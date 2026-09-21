import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Photo = {
  id: number;
  scope: "project" | "type" | "unit";
  category: string;
  storage_path: string;
  alt: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  project_slug: string | null;
  project_name: string | null;
  type_slug: string | null;
  type_name: string | null;
  unit_block: string | null;
  /** URL publik siap pakai di <Image> */
  url: string;
};

const KOLOM =
  "id, scope, category, storage_path, alt, caption, width, height, sort_order, project_slug, project_name, type_slug, type_name, unit_block";

/** URL publik sebuah objek di bucket "galeri". */
export function photoUrl(storagePath: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/galeri/${storagePath}`;
}

/** Semua foto terbit, sekali per request. */
export const getAllPhotos = cache(async (): Promise<Photo[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select(KOLOM)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Gagal mengambil foto:", error);
    return [];
  }
  return (data ?? []).map((p) => ({ ...p, url: photoUrl(p.storage_path) })) as Photo[];
});

/** Foto kawasan satu proyek (scope project). */
export async function getProjectPhotos(projectSlug: string) {
  const all = await getAllPhotos();
  return all.filter((p) => p.scope === "project" && p.project_slug === projectSlug);
}

/** Foto satu tipe rumah. */
export async function getTypePhotos(projectSlug: string, typeSlug: string) {
  const all = await getAllPhotos();
  return all.filter(
    (p) => p.scope === "type" && p.project_slug === projectSlug && p.type_slug === typeSlug
  );
}

/** Semua foto (kawasan + tipe) milik satu proyek, untuk halaman galeri. */
export async function getPhotosForProject(projectSlug: string) {
  const all = await getAllPhotos();
  return all.filter((p) => p.project_slug === projectSlug);
}

/** Sampul proyek: kategori "sampul", atau foto kawasan pertama sebagai cadangan. */
export async function getProjectCover(projectSlug: string): Promise<Photo | null> {
  const foto = await getProjectPhotos(projectSlug);
  return foto.find((p) => p.category === "sampul") ?? foto[0] ?? null;
}

/** Sampul tipe: "sampul", lalu "render", lalu apa pun. */
export async function getTypeCover(projectSlug: string, typeSlug: string): Promise<Photo | null> {
  const foto = await getTypePhotos(projectSlug, typeSlug);
  return (
    foto.find((p) => p.category === "sampul") ??
    foto.find((p) => p.category === "render") ??
    foto[0] ??
    null
  );
}
