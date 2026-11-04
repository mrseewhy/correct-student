import { z } from "zod";

export const mediaSchema = z.object({
  filename: z.string().min(1, "Filename is required").max(255),
  url: z.string().url("Invalid URL"),
  mediaType: z.enum(["video", "text", "audio"]),
});

export type MediaInput = z.infer<typeof mediaSchema>;
