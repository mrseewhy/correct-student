"use client";

import { useMemo, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

export function BlogEditor({ initialBody }: { initialBody?: string }) {
  const initialContent = useMemo(() => {
    if (!initialBody) return undefined;
    try { return JSON.parse(initialBody) as PartialBlock[]; } catch { return undefined; }
  }, [initialBody]);
  const editor = useCreateBlockNote({ initialContent });
  const [body, setBody] = useState(() => JSON.stringify(editor.document));
  const toolbarButton = "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring";
  function block(type: "paragraph" | "heading" | "bulletListItem" | "numberedListItem", level?: 1 | 2 | 3) {
    const current = editor.getTextCursorPosition().block;
    if (type === "heading") editor.updateBlock(current, { type, props: { level: level ?? 2 } });
    else editor.updateBlock(current, { type });
    editor.focus();
  }
  return <div className="rounded-xl border border-border bg-card">
    <div role="toolbar" aria-label="Blog editor formatting" className="sticky top-0 z-20 flex flex-wrap gap-2 border-b border-border bg-card p-3 shadow-sm">
      <button type="button" className={toolbarButton} onClick={() => block("paragraph")}>Paragraph</button>
      <button type="button" className={toolbarButton} onClick={() => block("heading", 2)}>Heading</button>
      <button type="button" className={toolbarButton} onClick={() => block("bulletListItem")}>Bullets</button>
      <button type="button" className={toolbarButton} onClick={() => block("numberedListItem")}>Numbers</button>
      <button type="button" className={toolbarButton} onClick={() => { editor.toggleStyles({ bold: true }); editor.focus(); }}>Bold</button>
      <button type="button" className={toolbarButton} onClick={() => { editor.toggleStyles({ italic: true }); editor.focus(); }}>Italic</button>
      <button type="button" className={toolbarButton} onClick={() => { editor.toggleStyles({ underline: true }); editor.focus(); }}>Underline</button>
      <button type="button" className={toolbarButton} onClick={() => { editor.undo(); editor.focus(); }}>Undo</button>
      <button type="button" className={toolbarButton} onClick={() => { editor.redo(); editor.focus(); }}>Redo</button>
    </div>
    <BlockNoteView editor={editor} onChange={() => setBody(JSON.stringify(editor.document))} formattingToolbar={false} slashMenu={false} sideMenu={false} filePanel={false} className="min-h-80 px-2 py-4" />
    <input type="hidden" name="body" value={body} />
  </div>;
}
