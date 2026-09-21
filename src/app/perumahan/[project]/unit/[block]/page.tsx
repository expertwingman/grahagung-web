import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyByProjectAndBlock } from "@/lib/properties-db";
import { PROJECTS } from "@/lib/projects-info";
import { projectPath, unitPath, propertySlug } from "@/lib/property-utils";
import { SITE, waLink } from "@/lib/site";
import UnitGallery from "@/components/UnitGallery";
import { getTypePhotos } from "@/lib/photos-db";
import LeadForm from "@/components/LeadForm";

// Stok & harga harus selalu terbaru dari database.
export const dynamic = "force-dynamic";

function formatRupiah(value: number | null) {
  if (value === null) {
    return "Harga belum tersedia";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusLabel(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "Tersedia";
    case "PRICE_PENDING":
      return "Harga belum tersedia";
    case "PURCHASE_IN_PROGRESS":
      return "Dalam proses pembelian";
    case "SOLD":
      return "Terjual";
    default:
      return status;
  }
}

function statusClass(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "bg-emerald-50 text-emerald-800";
    case "PRICE_PENDING":
      return "bg-amber-50 text-amber-800";
    case "PURCHASE_IN_PROGRESS":
      return "bg-blue-50 text-blue-800";
    case "SOLD":
      return "bg-red-50 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

type PropertyDetailPageProps = {
  params: Promise<{
    project: string;
    block: string;
  }>;
};

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { project, block } = await params;
  const p = await getPropertyByProjectAndBlock(project, block);
  if (!p) return { title: "Unit tidak ditemukan" };

  const info = PROJECTS[project];
  const judul = `Unit ${p.block} ${p.project} — ${p.floor}, ${p.buildingArea}/${p.landArea ?? "-"} m²`;
  const deskripsi =
    `${p.floor} ${p.buildingArea} m² di atas tanah ${p.landArea ?? "-"} m² di ${p.project}, ${info?.area ?? p.location}. ` +
    (p.price ? `Harga ${formatRupiah(p.price)}. ` : "") +
    `Sertifikat SHGB. Dijual langsung oleh ${SITE.legalName}.`;

  return {
    title: judul,
    description: deskripsi,
    // Halaman unit adalah varian dari halaman proyek; kanonik ke proyek
    // supaya 200+ unit serupa tidak dinilai sebagai konten duplikat.
    alternates: { canonical: projectPath(p.project) },
    openGraph: { title: judul, description: deskripsi, type: "website" },
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { project, block } = await params;
  const property = await getPropertyByProjectAndBlock(project, block);

  if (!property) {
    notFound();
  }

  const slug = propertySlug(property);
  const info = PROJECTS[project];
  const fotoTipe = property.typeSlug ? await getTypePhotos(project, property.typeSlug) : [];

  const canBuy =
    property.status === "AVAILABLE" &&
    property.price !== null;

  return (
    <main className="min-h-screen bg-[#f5f3ec] text-[#153c33]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Beranda", item: SITE.url },
              { "@type": "ListItem", position: 2, name: "Perumahan", item: `${SITE.url}/perumahan` },
              { "@type": "ListItem", position: 3, name: property.project, item: `${SITE.url}${projectPath(property.project)}` },
              { "@type": "ListItem", position: 4, name: `Unit ${property.block}`, item: `${SITE.url}${unitPath(property)}` },
            ],
          }),
        }}
      />

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#71807a]">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:underline">Beranda</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/perumahan" className="hover:underline">Perumahan</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={projectPath(property.project)} className="hover:underline">{property.project}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[#153c33]">Unit {property.block}</li>
          </ol>
        </nav>

        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">
            {property.project}
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#153c33] md:text-5xl">
                Unit {property.block}
              </h1>

              <p className="mt-2 text-sm text-[#61716b]">
                {property.location}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${statusClass(
                property.status
              )}`}
            >
              {statusLabel(property.status)}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT */}
          <div>
            {/* PROPERTY GALLERY */}
            <UnitGallery
              photos={fotoTipe}
              typeName={property.typeName}
              project={property.project}
              block={property.block}
              floor={property.floor}
              lb={property.buildingArea}
              lt={property.landArea}
            />

            {/* SUMMARY */}
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">
                Informasi Unit
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#153c33]">
                Detail properti
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/5 bg-white p-5">
                  <p className="text-xs text-[#71807a]">
                    Luas Bangunan
                  </p>

                  <p className="mt-2 text-xl font-semibold text-[#153c33]">
                    {property.buildingArea} m²
                  </p>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-5">
                  <p className="text-xs text-[#71807a]">
                    Luas Tanah
                  </p>

                  <p className="mt-2 text-xl font-semibold text-[#153c33]">
                    {property.landArea !== null
                      ? `${property.landArea} m²`
                      : "Belum tersedia"}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-5">
                  <p className="text-xs text-[#71807a]">
                    Jumlah Lantai
                  </p>

                  <p className="mt-2 text-xl font-semibold text-[#153c33]">
                    {property.floor}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-5">
                  <p className="text-xs text-[#71807a]">
                    Nomor SHGB
                  </p>

                  <p className="mt-2 text-xl font-semibold text-[#153c33]">
                    {property.shgb || "Belum tersedia"}
                  </p>
                </div>
              </div>
            </div>

            {/* PROPERTY DESCRIPTION */}
            <div className="mt-8 rounded-[2rem] border border-black/5 bg-white p-6 md:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">
                Tentang Unit
              </p>

              <p className="mt-4 text-sm leading-7 text-[#61716b]">
                Unit {property.block} merupakan bagian dari proyek{" "}
                <strong className="font-semibold text-[#153c33]">
                  {property.project}
                </strong>
                . Informasi teknis yang tersedia mencakup luas
                bangunan, luas tanah, jumlah lantai, dan nomor SHGB.
              </p>
            </div>
          </div>

          {/* RIGHT — PURCHASE CARD */}
          <aside className="h-fit rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm lg:sticky lg:top-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
              {property.location}
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-[#153c33]">
              Unit {property.block}
            </h2>

            <div className="mt-7 border-y border-black/10 py-6">
              <p className="text-sm text-[#71807a]">
                Harga jual
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#153c33]">
                {formatRupiah(property.price)}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-[#71807a]">
                  Status
                </span>

                <span className="font-semibold text-[#153c33]">
                  {statusLabel(property.status)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-[#71807a]">
                  Bangunan
                </span>

                <span className="font-semibold text-[#153c33]">
                  {property.buildingArea} m²
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-[#71807a]">
                  Tanah
                </span>

                <span className="font-semibold text-[#153c33]">
                  {property.landArea !== null
                    ? `${property.landArea} m²`
                    : "Belum tersedia"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-[#71807a]">
                  Lantai
                </span>

                <span className="font-semibold text-[#153c33]">
                  {property.floor}
                </span>
              </div>
            </div>

            <div className="mt-8">
              {canBuy ? (
                <>
                  <a
                    href="#ajukan"
                    className="block w-full rounded-full bg-[#153c33] px-6 py-4 text-center text-sm font-bold text-white transition hover:bg-[#285a4d]"
                  >
                    Ajukan pembelian
                  </a>

                  <a
                    href={waLink(`Halo, saya tertarik dengan unit ${property.block} di ${property.project}. Mohon informasinya.`)}
                    target="_blank"
                    rel="noopener"
                    className="mt-3 block w-full rounded-full border border-[#153c33] px-6 py-3.5 text-center text-sm font-semibold text-[#153c33] transition hover:bg-[#153c33] hover:text-white"
                  >
                    Tanya via WhatsApp
                  </a>

                  <p className="mt-4 text-center text-xs leading-5 text-[#85908b]">
                    Tim sales menghubungi Anda untuk jadwal survei dan tanda jadi.
                  </p>
                </>
              ) : (
                <div className="rounded-2xl bg-[#f3f5f4] p-4 text-center">
                  <p className="text-sm font-semibold text-[#153c33]">
                    Unit belum dapat dibeli secara online
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#71807a]">
                    Status atau harga unit belum memenuhi syarat
                    untuk pembelian online.
                  </p>
                </div>
              )}
            </div>

            <div id="ajukan" className="mt-8 scroll-mt-28 border-t border-black/10 pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
                {canBuy ? "Ajukan pembelian" : "Tanya unit ini"}
              </p>

              <h3 className="mt-2 text-lg font-semibold text-[#153c33]">
                {canBuy ? `Saya ingin membeli unit ${property.block}` : "Hubungi tim pemasaran"}
              </h3>

              <p className="mt-1 mb-5 text-xs leading-5 text-[#71807a]">
                {canBuy
                  ? "Tinggalkan kontak Anda. Tim kami menghubungi untuk jadwal survei, tanda jadi, dan pelunasan bersama notaris."
                  : "Tinggalkan kontak Anda, tim kami akan menghubungi."}
              </p>

              <LeadForm slug={slug} mode={canBuy ? "beli" : "tanya"} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
