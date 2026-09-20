import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Siteplan from "@/components/Siteplan";
import { getPropertiesByProject } from "@/lib/properties-db";
import { PROJECTS } from "@/lib/projects-info";
import { unitPath, formatRupiah, formatRupiahSingkat } from "@/lib/property-utils";
import { SITE, waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ project: string }> };

export async function generateStaticParams() {
  return Object.keys(PROJECTS).map((project) => ({ project }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { project } = await params;
  const info = PROJECTS[project];
  if (!info) return { title: "Proyek tidak ditemukan" };

  const units = await getPropertiesByProject(project);
  const tersedia = units.filter((u) => u.status === "AVAILABLE" && u.price !== null);
  const harga = tersedia.map((u) => u.price as number);
  const min = harga.length ? Math.min(...harga) : null;

  const judul = `${info.name} ${info.area} — Rumah Dijual ${min ? "Mulai " + formatRupiahSingkat(min) : ""}`.trim();

  return {
    title: judul,
    description: `${info.description} ${tersedia.length} unit tersedia. Sertifikat SHGB per kavling. Dijual langsung oleh ${SITE.legalName}.`,
    alternates: { canonical: `/perumahan/${project}` },
    openGraph: { title: judul, description: info.description, type: "website" },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { project } = await params;
  const info = PROJECTS[project];
  if (!info) notFound();

  const units = await getPropertiesByProject(project);
  if (units.length === 0) notFound();

  const tersedia = units.filter((u) => u.status === "AVAILABLE" && u.price !== null);
  const harga = tersedia.map((u) => u.price as number);
  const min = harga.length ? Math.min(...harga) : null;
  const max = harga.length ? Math.max(...harga) : null;

  // Kelompokkan tersedia per ukuran (LB/LT + lantai) untuk ringkasan tipe
  const perTipe = new Map<string, { lb: number; lt: number | null; floor: string; jumlah: number; min: number }>();
  for (const u of tersedia) {
    const key = `${u.floor}|${u.buildingArea}|${u.landArea ?? "-"}`;
    const t = perTipe.get(key) ?? { lb: u.buildingArea, lt: u.landArea, floor: u.floor, jumlah: 0, min: Infinity };
    t.jumlah += 1;
    t.min = Math.min(t.min, u.price as number);
    perTipe.set(key, t);
  }
  const tipe = Array.from(perTipe.values()).sort((a, b) => a.min - b.min);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: info.name,
    description: info.description,
    address: { "@type": "PostalAddress", addressLocality: info.area, addressRegion: "Jawa Timur", addressCountry: "ID" },
    url: `${SITE.url}/perumahan/${project}`,
    ...(min && max
      ? { offers: { "@type": "AggregateOffer", priceCurrency: "IDR", lowPrice: min, highPrice: max, offerCount: tersedia.length } }
      : {}),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO PROYEK */}
      <section className="bg-[#153c33] text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-white/60">
            <ol className="flex flex-wrap gap-2">
              <li><Link href="/" className="hover:text-white">Beranda</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/perumahan" className="hover:text-white">Perumahan</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white">{info.name}</li>
            </ol>
          </nav>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-[#d9c994]">
            {info.area}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {info.name}
          </h1>
          <p className="mt-2 text-lg text-white/70">{info.tagline}</p>

          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-6">
            <div>
              <p className="text-3xl font-semibold">{tersedia.length}</p>
              <p className="mt-1 text-xs text-white/60">Unit tersedia</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">{formatRupiahSingkat(min)}</p>
              <p className="mt-1 text-xs text-white/60">Harga mulai</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">SHGB</p>
              <p className="mt-1 text-xs text-white/60">Sertifikat per kavling</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          {/* KIRI: deskripsi & keunggulan */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">
              Tentang kawasan
            </p>
            <p className="mt-4 text-base leading-8 text-[#3d4b46]">{info.description}</p>

            {info.highlights.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {info.highlights.map((h) => (
                  <li key={h} className="flex gap-3 rounded-2xl bg-white p-4 text-sm">
                    <span className="mt-0.5 text-[#927845]">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {info.facilities.length > 0 && (
              <div className="mt-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">Fasilitas</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {info.facilities.map((f) => (
                    <span key={f} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {info.nearby.length > 0 && (
              <div className="mt-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">Akses lokasi</p>
                <ul className="mt-4 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
                  {info.nearby.map((n) => (
                    <li key={n.label} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                      <span>{n.label}</span>
                      <span className="shrink-0 font-semibold text-[#153c33]">{n.minutes} menit</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* KANAN: tipe & CTA */}
          <aside className="space-y-6">
            <div className="rounded-[1.5rem] border border-black/10 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">Pilihan tersedia</p>
              <ul className="mt-4 divide-y divide-black/10">
                {tipe.map((t) => (
                  <li key={`${t.floor}-${t.lb}-${t.lt}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold">{t.lb}/{t.lt ?? "-"} m² · {t.floor}</p>
                      <p className="text-xs text-[#71807a]">{t.jumlah} unit</p>
                    </div>
                    <p className="shrink-0 font-semibold text-[#153c33]">{formatRupiahSingkat(t.min)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] bg-[#153c33] p-6 text-white">
              <p className="text-sm font-semibold">Ingin survei lokasi?</p>
              <p className="mt-1 text-xs leading-5 text-white/70">
                Tim sales kami siap menemani Anda melihat unit secara langsung.
              </p>
              <a
                href={waLink(`Halo, saya ingin survei ${info.name}. Kapan bisa dijadwalkan?`)}
                target="_blank"
                rel="noopener"
                className="mt-4 block rounded-full bg-[#d9c994] px-5 py-3 text-center text-sm font-bold text-[#153c33] hover:bg-white"
              >
                Jadwalkan survei via WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* SITEPLAN & UNIT */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">
            {info.hasSiteplan ? "Siteplan & unit" : "Daftar unit"}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Pilih unit Anda</h2>

          {info.hasSiteplan ? (
            <div className="mt-8">
              <Siteplan properties={units} />
            </div>
          ) : (
            <div className="mt-8 overflow-x-auto rounded-2xl border border-black/10">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-[#f5f3ec] text-left text-xs uppercase tracking-wider text-[#71807a]">
                  <tr>
                    <th className="px-4 py-3">Blok</th>
                    <th className="px-4 py-3">Lantai</th>
                    <th className="px-4 py-3">LB / LT</th>
                    <th className="px-4 py-3">Harga</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {tersedia.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3 font-semibold">{u.block}</td>
                      <td className="px-4 py-3">{u.floor}</td>
                      <td className="px-4 py-3">{u.buildingArea}/{u.landArea ?? "-"} m²</td>
                      <td className="px-4 py-3">{formatRupiah(u.price)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={unitPath(u)} className="font-semibold text-[#153c33] underline-offset-4 hover:underline">
                          Detail →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
