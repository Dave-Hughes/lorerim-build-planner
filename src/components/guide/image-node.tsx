"use client";

import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { useSyncExternalStore } from "react";
import { forgetUpload, retryUpload, subscribeUploads, uploadState } from "./image-upload";
import styles from "./guide-editor.module.css";

function ImageView({ node, editor, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const id = node.attrs.uploadId as string | null;
  const st = useSyncExternalStore(subscribeUploads, () => (id ? uploadState(id) : undefined), () => undefined);
  const src = node.attrs.src as string | null;
  const remove = () => {
    if (id) forgetUpload(id);
    deleteNode();
  };

  if (!src) {
    return (
      <NodeViewWrapper className={styles.image} data-uploading="">
        <div className={styles.imageBox}>
          {st?.preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={st.preview} alt="" className={styles.imagePending} />
          )}
          <div className={styles.imageStatus} role={st?.error ? "alert" : "status"}>
            {!st ? (
              <span>The upload was interrupted.</span>
            ) : st.error ? (
              <span>{st.error}</span>
            ) : (
              <span>Uploading {Math.round(st.progress * 100)}%</span>
            )}
            {(!st || st.error) && (
              <span className={styles.imageActions}>
                {st?.retryable && (
                  <button type="button" className="btn btn-sm" onClick={() => id && retryUpload(editor, id)}>
                    Try again
                  </button>
                )}
                <button type="button" className="btn btn-sm btn-quiet" onClick={remove}>
                  Remove
                </button>
              </span>
            )}
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className={`${styles.image} ${selected ? styles.imageSelected : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={node.attrs.alt ?? ""} width={node.attrs.width ?? undefined} height={node.attrs.height ?? undefined} data-drag-handle="" />
      <div className={styles.imageFields}>
        <label className={styles.imageField}>
          <span className="sr-only">Caption</span>
          <input
            className={styles.caption}
            value={node.attrs.caption ?? ""}
            maxLength={300}
            placeholder="[Caption]"
            onChange={(e) => updateAttributes({ caption: e.target.value })}
          />
        </label>
        <label className={styles.imageField}>
          <span className="sr-only">Alt text</span>
          <input
            className={styles.alt}
            value={node.attrs.alt ?? ""}
            maxLength={300}
            placeholder="[Alt text: what the image shows, for screen readers]"
            autoFocus={!node.attrs.alt && !node.attrs.caption}
            onChange={(e) => updateAttributes({ alt: e.target.value })}
          />
        </label>
        <button type="button" className="btn btn-sm btn-quiet" onClick={remove}>
          Remove
        </button>
      </div>
    </NodeViewWrapper>
  );
}

/** Tiptap's Image with a caption, its size, and the upload it is waiting on. */
export const GuideImage = Image.extend({
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: null },
      width: { default: null },
      height: { default: null },
      // Not saved: unfinished images are left out of every save.
      uploadId: { default: null, rendered: false },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageView, {
      // Typing in the caption and alt fields stays in the fields.
      stopEvent: ({ event }) => event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement,
    });
  },
}).configure({ inline: false, allowBase64: false });
