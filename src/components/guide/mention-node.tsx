"use client";

import Mention from "@tiptap/extension-mention";
import { NodeViewWrapper, ReactNodeViewRenderer, mergeAttributes, type NodeViewProps } from "@tiptap/react";
import type { SuggestionOptions } from "@tiptap/suggestion";
import { PluginKey } from "@tiptap/pm/state";
import { mentionFallbackLabel, type MentionInfo } from "@/lib/guide/mention";
import { GuideMention } from "./guide-facts";

function MentionView({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper as="span">
      <GuideMention kind={node.attrs.kind} id={node.attrs.id} label={node.attrs.label} />
    </NodeViewWrapper>
  );
}

/** A mention stores only { kind, id }; the chip's name and text come from the game data. */
export function guideMention(suggestion: Pick<SuggestionOptions<MentionInfo>, "items" | "render">) {
  return Mention.extend({
    addAttributes() {
      return {
        kind: { default: null, parseHTML: (el) => el.getAttribute("data-kind"), renderHTML: (a) => ({ "data-kind": a.kind }) },
        id: { default: null, parseHTML: (el) => el.getAttribute("data-id"), renderHTML: (a) => ({ "data-id": a.id }) },
        // Items only: the name, shown until the item index is fetched (and if the item ever leaves it).
        label: { default: null, parseHTML: (el) => el.getAttribute("data-label"), renderHTML: (a) => (a.label ? { "data-label": a.label } : {}) },
      };
    },
    parseHTML() {
      return [{ tag: "span[data-mention]" }];
    },
    renderHTML({ node, HTMLAttributes }) {
      return ["span", mergeAttributes({ "data-mention": "" }, HTMLAttributes), mentionFallbackLabel(node.attrs.id ?? "", node.attrs.label)];
    },
    renderText({ node }) {
      return mentionFallbackLabel(node.attrs.id ?? "", node.attrs.label);
    },
    addNodeView() {
      return ReactNodeViewRenderer(MentionView, { as: "span" });
    },
  }).configure({
    deleteTriggerWithBackspace: true,
    suggestion: {
      char: "@",
      pluginKey: new PluginKey("guideMention"),
      allowSpaces: true,
      items: suggestion.items,
      render: suggestion.render,
      command: ({ editor, range, props }) => {
        const m = props as unknown as MentionInfo;
        editor
          .chain()
          .focus()
          .insertContentAt(range, [
            { type: "mention", attrs: { kind: m.kind, id: m.id, ...(m.kind === "item" ? { label: m.name } : {}) } },
            { type: "text", text: " " },
          ])
          .run();
      },
    },
  });
}
