import { PHOTOS_BUCKET } from "@/features/photos/photosServerFns";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && /^[a-z0-9]{2,5}$/i.test(fromName)) return fromName.toLowerCase();
  const fromType = file.type.split("/")[1];
  return fromType ? fromType.toLowerCase() : "jpg";
}

// Uploads straight from the browser to Storage using the signed-in user's
// own session — Storage RLS (not this function) enforces trip membership.
export async function uploadTripPhoto(tripId: string, file: File): Promise<string> {
  const path = `${tripId}/${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await getSupabaseBrowserClient()
    .storage.from(PHOTOS_BUCKET)
    .upload(path, file, { contentType: file.type || undefined });
  if (error) throw error;
  return path;
}
