"use client";

import type { Editor } from "@tiptap/react";
import { IMAGE_LIMITS, IMAGE_TYPES, IMAGE_TYPE_ERROR, imageTooBigMessage, type GuideDoc, type GuideNode } from "@/lib/guide/doc";

/**
 * Images being uploaded into the guide. The document holds an image node with an
 * `uploadId` and no `src` until the upload finishes; this store holds its preview,
 * progress and any error, for the node view to show. Unfinished images are never saved.
 */
export interface UploadState {
  preview: string;
  progress: number;
  error: string | null;
  /** False when trying again can't help (wrong kind of file, too big). */
  retryable: boolean;
  file: File;
  buildId: string;
}

const uploads = new Map<string, UploadState>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function subscribeUploads(fn: () => void): () => void {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

export function uploadState(id: string): UploadState | undefined {
  return uploads.get(id);
}

function set(id: string, patch: Partial<UploadState>) {
  const cur = uploads.get(id);
  if (!cur) return;
  uploads.set(id, { ...cur, ...patch });
  emit();
}

function findPos(editor: Editor, id: string): number | null {
  let pos: number | null = null;
  editor.state.doc.descendants((node, p) => {
    if (pos === null && node.type.name === "image" && node.attrs.uploadId === id) pos = p;
    return pos === null;
  });
  return pos;
}

/** Sends the file with progress; resolves to its public URL or rejects with the server's reason. */
function send(buildId: string, file: File, onProgress: (n: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/builds/${buildId}/images`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      let body: { url?: string; error?: string } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        // Not JSON: the platform refused it before our code ran.
      }
      if (xhr.status === 200 && body.url) resolve(body.url);
      else if (xhr.status === 413) reject(new Error(body.error ?? imageTooBigMessage(file.size)));
      else reject(new Error(body.error ?? "The upload didn't finish. Try again."));
    };
    xhr.onerror = () => reject(new Error("Couldn't reach the server. Try again."));
    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
}

async function run(editor: Editor, id: string) {
  const st = uploads.get(id);
  if (!st) return;
  set(id, { error: null, progress: 0 });
  try {
    const url = await send(st.buildId, st.file, (n) => set(id, { progress: n }));
    const pos = findPos(editor, id);
    if (pos === null) return; // Removed while uploading.
    editor
      .chain()
      .command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, { ...editor.state.doc.nodeAt(pos)!.attrs, src: url, uploadId: null });
        return true;
      })
      .run();
    uploads.delete(id);
    URL.revokeObjectURL(st.preview);
    emit();
  } catch (e) {
    set(id, { error: e instanceof Error ? e.message : "The upload didn't finish." });
  }
}

export function retryUpload(editor: Editor, id: string) {
  void run(editor, id);
}

export function forgetUpload(id: string) {
  const st = uploads.get(id);
  if (st) URL.revokeObjectURL(st.preview);
  uploads.delete(id);
  emit();
}

async function size(file: File): Promise<{ width: number; height: number } | null> {
  try {
    const bmp = await createImageBitmap(file);
    const out = { width: bmp.width, height: bmp.height };
    bmp.close();
    return out;
  } catch {
    return null;
  }
}

/** Adds images to the document at `pos` (or the cursor) and uploads them. */
export async function insertImages(editor: Editor, buildId: string, files: File[], pos?: number) {
  for (const file of files) {
    const id = crypto.randomUUID();
    const typeOk = (IMAGE_TYPES as readonly string[]).includes(file.type);
    const error = !typeOk ? IMAGE_TYPE_ERROR : file.size > IMAGE_LIMITS.bytes ? imageTooBigMessage(file.size) : null;
    const dims = typeOk ? await size(file) : null;
    uploads.set(id, { preview: typeOk ? URL.createObjectURL(file) : "", progress: 0, error, retryable: !error, file, buildId });
    const node = { type: "image", attrs: { src: null, uploadId: id, width: dims?.width ?? null, height: dims?.height ?? null } };
    // With something selected (an image just added, a word), add after it rather than over it.
    const sel = editor.state.selection;
    const at = pos ?? (sel.empty ? undefined : sel.to);
    const chain = editor.chain().focus();
    if (at !== undefined) chain.insertContentAt(at, node);
    else chain.insertContent(node);
    chain.run();
    emit();
    if (!error) void run(editor, id);
  }
}

/** A document as it is saved: images still uploading (or failed) are left out. */
export function withoutUnfinishedImages(doc: GuideDoc): GuideDoc {
  const strip = (n: GuideNode): GuideNode =>
    n.content ? { ...n, content: n.content.filter((c) => !(c.type === "image" && !c.attrs?.src)).map(strip) } : n;
  return strip(doc) as GuideDoc;
}
