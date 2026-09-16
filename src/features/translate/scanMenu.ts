import { scanMenu, type ScannedMenu } from "@/features/translate/translateServerFns";

const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.slice(result.indexOf(",") + 1);
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

export async function scanMenuPhoto(file: File): Promise<ScannedMenu> {
  const mediaType = SUPPORTED_TYPES.has(file.type) ? file.type : "image/jpeg";
  const imageBase64 = await readFileAsBase64(file);
  return scanMenu({
    data: {
      imageBase64,
      mediaType: mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
    },
  });
}
