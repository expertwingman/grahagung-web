// Hanya fungsi murni, tanpa impor kode server.
// Aman dipakai dari komponen client.

export function slugify(teks: string) {
  return teks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** "Wisata Semanggi" -> "wisata-semanggi" */
export function projectSlug(project: string) {
  return slugify(project);
}

/** "K.1-11" -> "k-1-11" */
export function blockSlug(block: string) {
  return slugify(block);
}

/** /perumahan/wisata-semanggi */
export function projectPath(project: string) {
  return `/perumahan/${projectSlug(project)}`;
}

/** /perumahan/wisata-semanggi/unit/k-1-11 */
export function unitPath(p: { project: string; block: string }) {
  return `${projectPath(p.project)}/unit/${blockSlug(p.block)}`;
}

/**
 * Slug lama gabungan "wisata-semanggi-k-1-11".
 * Masih dipakai untuk mengalihkan URL lama ke URL baru.
 */
export function propertySlug(p: { project: string; block: string }) {
  return slugify(`${p.project}-${p.block}`);
}

export function formatRupiah(n: number | null | undefined) {
  if (n === null || n === undefined) return "Harga belum tersedia";
  return "Rp " + n.toLocaleString("id-ID");
}

/** 2.000.000.000 -> "Rp 2 M" ; 817.000.000 -> "Rp 817 jt" */
export function formatRupiahSingkat(n: number | null | undefined) {
  if (n === null || n === undefined) return "-";
  if (n >= 1_000_000_000) {
    const m = n / 1_000_000_000;
    return `Rp ${m.toLocaleString("id-ID", { maximumFractionDigits: 2 })} M`;
  }
  return `Rp ${Math.round(n / 1_000_000).toLocaleString("id-ID")} jt`;
}
