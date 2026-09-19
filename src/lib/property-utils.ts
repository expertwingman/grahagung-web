// Hanya berisi fungsi murni, tanpa impor kode server.
// Aman dipakai dari komponen client (PropertyBrowser, Siteplan).

export function propertySlug(property: { project: string; block: string }) {
  return `${property.project}-${property.block}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
