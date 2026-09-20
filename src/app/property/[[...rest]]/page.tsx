import { permanentRedirect } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties-db";
import { unitPath } from "@/lib/property-utils";

/**
 * Pengalihan permanen dari struktur URL lama (/property/…)
 * ke struktur baru (/perumahan/…).
 */
export const dynamic = "force-dynamic";

export default async function PropertyRedirect({
  params,
}: {
  params: Promise<{ rest?: string[] }>;
}) {
  const { rest = [] } = await params;

  if (rest.length === 0) permanentRedirect("/perumahan");

  const slug = rest[0];

  // /property/wisata-semanggi -> halaman proyek
  if (slug === "wisata-semanggi") permanentRedirect("/perumahan/wisata-semanggi");

  // /property/wisata-semanggi-k-1-11 -> halaman unit baru
  const unit = await getPropertyBySlug(slug);
  if (unit) permanentRedirect(unitPath(unit));

  permanentRedirect("/perumahan");
}
