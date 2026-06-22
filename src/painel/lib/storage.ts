import { supabase } from "@/lib/supabase";

const BUCKET = "project-files";

export async function uploadProjectFile(
  projectId: string,
  file: File,
  subfolder = "field",
): Promise<{ path: string | null; error: string | null }> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${projectId}/${subfolder}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type,
  });

  if (error) return { path: null, error: error.message };
  return { path, error: null };
}

export async function getSignedUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}

export async function downloadProjectFile(path: string, filename: string) {
  const url = await getSignedUrl(path);
  if (!url) return;
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
