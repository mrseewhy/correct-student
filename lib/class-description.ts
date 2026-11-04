/** Extract readable text from BlockNote's saved block document. */
export function classDescriptionText(value: string): string {
  try {
    const blocks: unknown = JSON.parse(value);
    if (!Array.isArray(blocks)) return value;
    const read = (part: unknown): string => {
      if (!part || typeof part !== "object") return "";
      const node = part as { text?: unknown; content?: unknown; children?: unknown };
      if (typeof node.text === "string") return node.text;
      return [node.content, node.children]
        .filter(Array.isArray)
        .flatMap(items => (items as unknown[]).map(read))
        .join("");
    };
    return blocks.map(read).filter(Boolean).join("\n");
  } catch {
    return value;
  }
}

export function classDescriptionExcerpt(value: string, length = 180): string {
  const text = classDescriptionText(value).replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}
