import { redirect } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties-db";
import CheckoutForm from "./CheckoutForm";

// Stok & harga harus selalu terbaru dari database.
export const dynamic = "force-dynamic";

// Alur transaksi: jangan diindeks, belum ditautkan dari mana pun.
export const metadata = { robots: { index: false, follow: false } };

type CheckoutPageProps = {
  searchParams: Promise<{
    property?: string;
  }>;
};

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

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;

  if (!params.property) {
    redirect("/property");
  }

  const property = await getPropertyBySlug(params.property);

  if (!property) {
    redirect("/property");
  }

  return (
    <main className="min-h-screen bg-[#f5f3ec] text-[#153c33]">

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-10 lg:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">
          Pembelian Properti
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Checkout
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-[#66756f]">
          Lengkapi data pembeli sebelum melanjutkan ke pembayaran.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px]">
          <section className="rounded-[2rem] bg-white p-7 shadow-sm">
            <div className="border-b border-black/10 pb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
                {property.project}
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Unit {property.block}
              </h2>

              <p className="mt-1 text-sm text-[#707c77]">
                {property.location}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold">
                Data pembeli
              </h3>

              <div className="mt-6">
                <CheckoutForm
                  propertySlug={params.property}
                  propertyName={`Unit ${property.block}`}
                />
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] bg-white p-7 shadow-sm lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
              Ringkasan
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              Unit {property.block}
            </h2>

            <p className="mt-1 text-sm text-[#707c77]">
              {property.project}
            </p>

            <div className="mt-6 space-y-4 border-y border-black/10 py-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#78847f]">
                  Luas bangunan
                </span>

                <strong>{property.buildingArea} m²</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#78847f]">
                  Luas tanah
                </span>

                <strong>{property.landArea} m²</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#78847f]">
                  Pembayaran
                </span>

                <strong>Full payment</strong>
              </div>
            </div>

            <p className="mt-6 text-sm text-[#78847f]">
              Total pembayaran
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {formatRupiah(property.price)}
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
