export function youtubeUrl(value: string) {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== "https:" || !["youtube.com", "www.youtube.com", "youtu.be", "www.youtu.be"].includes(url.hostname)) throw new Error("Use a valid YouTube HTTPS URL.");
  const id = url.hostname.includes("youtu.be") ? url.pathname.slice(1) : url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1);
  if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) throw new Error("Use a valid YouTube video URL.");
  return `https://www.youtube.com/watch?v=${id}`;
}

export async function uploaded(file: FormDataEntryValue | null, kind: "audio" | "pdf") {
  if (!(file instanceof File) || !file.size) return null;
  if (file.size > 3_000_000) throw new Error(`${kind.toUpperCase()} must be under 3 MB.`);
  const bytes = Buffer.from(await file.arrayBuffer());
  const pdf = bytes.toString("ascii", 0, 5) === "%PDF-";
  const mp3 = bytes.toString("ascii", 0, 3) === "ID3" || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
  const wav = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WAVE";
  const ogg = bytes.toString("ascii", 0, 4) === "OggS";
  const mimeType = kind === "pdf" && pdf ? "application/pdf" : kind === "audio" && mp3 ? "audio/mpeg" : kind === "audio" && wav ? "audio/wav" : kind === "audio" && ogg ? "audio/ogg" : null;
  if (!mimeType) throw new Error(kind === "pdf" ? "Upload a valid PDF." : "Upload an MP3, WAV, or OGG audio file.");
  return { kind, content: bytes.toString("base64"), mimeType, filename: file.name.slice(0, 255) } as const;
}

export async function coverImage(file: FormDataEntryValue | null, existing: string | null) {
  if (!(file instanceof File) || !file.size) return existing;
  if (file.size > 2_000_000) throw new Error("Cover image must be under 2 MB.");
  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? "image/png"
    : bytes.subarray(0, 3).equals(Buffer.from([255,216,255])) ? "image/jpeg"
    : bytes.toString("ascii",0,4) === "RIFF" && bytes.toString("ascii",8,12) === "WEBP" ? "image/webp" : null;
  if (!mime) throw new Error("Cover image must be PNG, JPEG, or WebP.");
  return `data:${mime};base64,${bytes.toString("base64")}`;
}
