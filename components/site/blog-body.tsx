import type { ReactNode } from "react";

type Inline = { type?: string; text?: string; href?: string; styles?: Record<string, unknown>; content?: Inline[] };
type Block = { id?: string; type?: string; props?: { level?: number }; content?: Inline[]; children?: Block[] };

function inline(nodes: Inline[] | undefined): ReactNode {
  if (!Array.isArray(nodes)) return null;
  return nodes.map((node, index) => {
    if (!node || typeof node !== "object") return null;
    if (node.type === "link") {
      const safe = typeof node.href === "string" && /^(https?:\/\/|mailto:)/i.test(node.href);
      return safe ? <a key={index} href={node.href} rel="noopener noreferrer" className="underline">{inline(node.content)}</a> : <span key={index}>{inline(node.content)}</span>;
    }
    if (typeof node.text !== "string") return null;
    let value: ReactNode = node.text;
    if (node.styles?.bold) value = <strong>{value}</strong>;
    if (node.styles?.italic) value = <em>{value}</em>;
    if (node.styles?.underline) value = <u>{value}</u>;
    return <span key={index}>{value}</span>;
  });
}

function renderBlocks(blocks: Block[]): ReactNode {
  return blocks.map((block, index) => {
    if (!block || typeof block !== "object") return null;
    const key = block.id ?? index;
    const content = inline(block.content);
    const children = Array.isArray(block.children) ? renderBlocks(block.children) : null;
    switch (block.type) {
      case "heading": return <div key={key}><h2 className="mt-10 mb-4 text-2xl leading-snug text-primary sm:text-3xl">{content}</h2>{children}</div>;
      case "bulletListItem": return <div key={key} className="ml-6 list-item list-disc py-1 leading-8">{content}{children}</div>;
      case "numberedListItem": return <div key={key} className="ml-6 list-item list-decimal py-1 leading-8">{content}{children}</div>;
      case "paragraph": return <div key={key}><p className="my-5 leading-8">{content}</p>{children}</div>;
      default: return null;
    }
  });
}

export function BlogBody({ body }: { body: string }) {
  let blocks: Block[] = [];
  try { const parsed = JSON.parse(body); if (Array.isArray(parsed)) blocks = parsed; } catch { /* Old or invalid content renders empty. */ }
  return <div className="text-base text-foreground/85 sm:text-lg">{renderBlocks(blocks)}</div>;
}
