import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties-db";
import PropertyGallery from "@/components/PropertyGallery";
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
    slug: string;
  }>;
};

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const canBuy =
    property.status === "AVAILABLE" &&
    property.price !== null;

  return (
    <main className="min-h-screen bg-[#f5f3ec] text-[#153c33]">
      {/* HEADER */}
      <header className="border-b border-black/10 bg-[#f5f3ec]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="/property">
            <div className="text-[10px] font-semibold tracking-[0.34em] text-[#6c806f]">
              GRAHA AGUNG
            </div>

            <div className="text-lg font-bold tracking-tight">
              KENCANA GROUP
            </div>
          </a>

          <a
            href="/property"
            className="rounded-full border border-[#153c33] px-5 py-2 text-sm font-semibold transition hover:bg-[#153c33] hover:text-white"
          >
            Kembali
          </a>
        </div>
      </header>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
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
            <PropertyGallery
              slug={slug}
              project={property.project}
              block={property.block}
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
                    href={`/checkout?property=${encodeURIComponent(slug)}`}
                    className="block w-full rounded-full bg-[#153c33] px-6 py-4 text-center text-sm font-bold text-white transition hover:bg-[#285a4d]"
                  >
                    BELI SEKARANG
                  </a>

                  <p className="mt-4 text-center text-xs leading-5 text-[#85908b]">
                    Anda akan melanjutkan ke proses checkout.
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

            <div className="mt-8 border-t border-black/10 pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
                Tanya unit ini
              </p>

              <h3 className="mt-2 text-lg font-semibold text-[#153c33]">
                Hubungi tim pemasaran
              </h3>

              <p className="mt-1 mb-5 text-xs leading-5 text-[#71807a]">
                Tinggalkan kontak Anda, tim kami akan menghubungi.
              </p>

              <LeadForm slug={slug} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
