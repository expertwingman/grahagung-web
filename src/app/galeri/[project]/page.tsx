import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/projects-info";
import { waLink } from "@/lib/site";
import { getPhotosForProject } from "@/lib/photos-db";
import PhotoGrid from "@/components/PhotoGrid";

type Props = { params: Promise<{ project: string }> };

export async function generateStaticParams() {
  return Object.keys(PROJECTS).map((project) => ({ project }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { project } = await params;
  const info = PROJECTS[project];
  if (!info) return { title: "Galeri" };
  return {
    title: `Galeri ${info.name}`,
    description: `Foto kawasan, fasilitas, dan rumah contoh ${info.name}, ${info.area}.`,
    alternates: { canonical: `/galeri/${project}` },
  };
}

export default async function GaleriProyekPage({ params }: Props) {
  const { project } = await params;
  const info = PROJECTS[project];
  if (!info) notFound();

  const semua = await getPhotosForProject(project);
  const kawasan = semua.filter((f) => f.scope === "project" && f.category !== "sampul");
  const perTipe = new Map<string, typeof semua>();
  for (const f of semua) {
    if (f.scope !== "type" || !f.type_slug) continue;
    perTipe.set(f.type_slug, [...(perTipe.get(f.type_slug) ?? []), f]);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <nav aria-label="Breadcrumb" className="text-xs text-[#71807a]">
        <Link href="/galeri" className="hover:underline">Galeri</Link> / {info.name}
      </nav>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{info.name}</h1>
      <p className="mt-2 text-[#64736d]">{info.area}</p>

      {kawasan.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Kawasan &amp; fasilitas</h2>
          <div className="mt-4"><PhotoGrid photos={kawasan} columns={3} /></div>
        </section>
      )}

      {Array.from(perTipe.entries()).map(([slug, foto]) => (
        <section key={slug} className="mt-10">
          <h2 className="text-xl font-semibold">Tipe {foto[0].type_name ?? slug}</h2>
          <div className="mt-4"><PhotoGrid photos={foto} columns={3} /></div>
        </section>
      ))}

      {semua.length === 0 && (
      <div className="mt-10 rounded-[1.5rem] border border-dashed border-black/15 bg-white p-10 text-center">
        <p className="text-sm text-[#64736d]">
          Foto {info.name} sedang disiapkan. Ingin melihat langsung?
        </p>
        <a
          href={waLink(`Halo, saya ingin melihat foto atau survei ${info.name}.`)}
          target="_blank"
          rel="noopener"
          className="mt-4 inline-block rounded-full bg-[#153c33] px-6 py-3 text-sm font-bold text-white hover:bg-[#285a4d]"
        >
          Minta foto via WhatsApp
        </a>
      </div>
      )}

      <div className="mt-8">
        <Link href={`/perumahan/${project}`} className="text-sm font-semibold underline-offset-4 hover:underline">
          ← Lihat unit tersedia di {info.name}
        </Link>
      </div>
    </main>
  );
}
