import { classDescriptionText } from "@/lib/class-description";

export function hasCompletableContent(item: {
  mediaTypeName: string;
  description: string;
  materials: readonly { kind: string }[];
}) {
  if (item.mediaTypeName.toLowerCase() === "text") {
    return Boolean(classDescriptionText(item.description).trim() || item.materials.length);
  }
  return item.materials.some(material =>
    item.mediaTypeName.toLowerCase() === "video" ? material.kind === "youtube" : material.kind === "audio",
  );
}
