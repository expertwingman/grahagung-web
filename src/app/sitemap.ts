import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllProperties, getProjectSummaries } from "@/lib/properties-db";
import { unitPath, projectPath } from "@/lib/property-utils";

export const revalidate = 3600; // 1 jam

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  const statis: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/perumahan`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/galeri`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/cara-membeli`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tentang`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/kontak`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const proyek = await getProjectSummaries();
  const halamanProyek: MetadataRoute.Sitemap = proyek.map((p) => ({
    url: `${base}${projectPath(p.name)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Hanya unit yang benar-benar dijual yang masuk sitemap
  const units = await getAllProperties();
  const halamanUnit: MetadataRoute.Sitemap = units
    .filter((u) => u.status === "AVAILABLE" && u.price !== null)
    .map((u) => ({
      url: `${base}${unitPath(u)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  return [...statis, ...halamanProyek, ...halamanUnit];
}
