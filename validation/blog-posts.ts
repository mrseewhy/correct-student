import { z } from "zod";

export const blogPostSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  title: z.string().trim().min(3).max(180),
  body: z.string().min(10).max(150_000).refine((value) => {
    try {
      const blocks: unknown = JSON.parse(value);
      return Array.isArray(blocks) && blocks.some((block) =>
        block && typeof block === "object" && "content" in block && Array.isArray(block.content) &&
        block.content.some((item: unknown) => item && typeof item === "object" && "text" in item &&
          typeof item.text === "string" && item.text.trim().length > 0));
    } catch { return false; }
  }, "Add article text before saving"),
  published: z.boolean(),
});
