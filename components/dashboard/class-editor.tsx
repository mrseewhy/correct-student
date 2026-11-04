"use client";

import { useMemo, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const toolbarButton = "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring";

/**
 * Inner editor that mounts only on the client. BlockNote's `useCreateBlockNote`
 * requires `window`, so it must not be invoked during server-side rendering.
 */
function BlockNoteEditorInner({
  initialContent,
  name,
}: {
  initialContent: PartialBlock[] | undefined;
  name: string;
}) {
  const editor = useCreateBlockNote({ initialContent });
  const [description, setDescription] = useState(() =>
    JSON.stringify(editor.document),
  );

  return (
    <div className="rounded-xl border border-border bg-card">
      <div
        role="toolbar"
        aria-label="Class description formatting"
        className="sticky top-0 z-20 flex flex-wrap gap-2 border-b border-border bg-card p-3 shadow-sm"
      >
        <button
          type="button"
          className={toolbarButton}
          onClick={() => {
            const current = editor.getTextCursorPosition().block;
            editor.updateBlock(current, { type: "paragraph" });
            editor.focus();
          }}
        >
          Paragraph
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => {
            const current = editor.getTextCursorPosition().block;
            editor.updateBlock(current, { type: "heading", props: { level: 2 } });
            editor.focus();
          }}
        >
          Heading
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => {
            const current = editor.getTextCursorPosition().block;
            editor.updateBlock(current, { type: "bulletListItem" });
            editor.focus();
          }}
        >
          Bullets
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => {
            const current = editor.getTextCursorPosition().block;
            editor.updateBlock(current, { type: "numberedListItem" });
            editor.focus();
          }}
        >
          Numbers
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => {
            editor.toggleStyles({ bold: true });
            editor.focus();
          }}
        >
          Bold
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => {
            editor.toggleStyles({ italic: true });
            editor.focus();
          }}
        >
          Italic
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => {
            editor.toggleStyles({ underline: true });
            editor.focus();
          }}
        >
          Underline
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => {
            editor.undo();
            editor.focus();
          }}
        >
          Undo
        </button>
        <button
          type="button"
          className={toolbarButton}
          onClick={() => {
            editor.redo();
            editor.focus();
          }}
        >
          Redo
        </button>
      </div>
      <BlockNoteView
        editor={editor}
        onChange={() => setDescription(JSON.stringify(editor.document))}
        formattingToolbar={false}
        slashMenu={false}
        sideMenu={false}
        filePanel={false}
        className="min-h-[300px] px-2 py-4"
      />
      <input type="hidden" name={name} value={description} />
    </div>
  );
}

/**
 * WYSIWYG editor for the class description. Renders a placeholder during SSR
 * and swaps in the BlockNote editor once mounted on the client.
 */
export function ClassEditor({
  initialDescription,
  name = "description",
}: {
  initialDescription?: string;
  name?: string;
}) {
  const initialContent = useMemo(() => {
    if (!initialDescription) return undefined;
    try {
      return JSON.parse(initialDescription) as PartialBlock[];
    } catch {
      // Existing descriptions may be plain text; wrap as a single paragraph.
      return [
        {
          type: "paragraph" as const,
          content: [{ type: "text" as const, text: initialDescription, styles: {} }],
        },
      ];
    }
  }, [initialDescription]);

  // BlockNote's `useCreateBlockNote` requires `window`, which is unavailable
  // during server-side rendering. Render a placeholder on the server and
  // swap in the editor once on the client.
  if (typeof window === "undefined") {
    return (
      <div className="min-h-[300px] rounded-xl border border-border bg-card flex items-center justify-center text-sm text-muted-foreground">
        Loading editor…
      </div>
    );
  }

  return <BlockNoteEditorInner initialContent={initialContent} name={name} />;
}
