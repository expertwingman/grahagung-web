import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects-info";
import { getProjectCover } from "@/lib/photos-db";
import CoverImage from "@/components/CoverImage";

export const metadata: Metadata = {
  title: "Galeri Foto Proyek",
  description:
    "Foto gerbang, fasilitas, rumah contoh, dan progres pembangunan proyek Graha Agung Kencana Group di Surabaya, Malang, dan Sidoarjo.",
  alternates: { canonical: "/galeri" },
};

export default async function GaleriPage() {
  const sampul = Object.fromEntries(
    await Promise.all(Object.keys(PROJECTS).map(async (slug) => [slug, await getProjectCover(slug)] as const))
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">Galeri</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Lihat langsung kawasannya</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[#64736d]">
        Foto gerbang, fasilitas, rumah contoh, dan progres pembangunan — diperbarui
        oleh tim kami dari lapangan.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {Object.values(PROJECTS).map((p) => (
          <Link
            key={p.slug}
            href={`/galeri/${p.slug}`}
            className="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
          >
            <CoverImage photo={sampul[p.slug] ?? null} alt={p.name} sizes="(max-width: 768px) 100vw, 33vw" className="aspect-[4/3]" />
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">{p.area}</p>
              <h2 className="mt-1 text-xl font-semibold">{p.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
