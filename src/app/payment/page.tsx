import { redirect } from "next/navigation";
import { getPropertyBySlug } from "@/lib/property-utils";

type PaymentPageProps = {
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

export default async function PaymentPage({
  searchParams,
}: PaymentPageProps) {
  const params = await searchParams;

  if (!params.property) {
    redirect("/property");
  }

  const property = getPropertyBySlug(params.property);

  if (!property) {
    redirect("/property");
  }

  return (
    <main className="min-h-screen bg-[#f5f3ec] text-[#153c33]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="/">
            <div className="text-[10px] font-semibold tracking-[0.34em] text-[#6c806f]">
              GRAHA AGUNG
            </div>

            <div className="text-lg font-bold">
              KENCANA GROUP
            </div>
          </a>

          <span className="text-sm text-[#687570]">
            Payment
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-10 lg:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">
          Pembayaran
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Pilih metode pembayaran
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="rounded-[2rem] bg-white p-7 shadow-sm">
            <div className="rounded-2xl border border-black/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
                Kartu
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Visa / Mastercard
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#707c77]">
                Pembayaran kartu akan diproses melalui payment
                processor yang disetujui untuk merchant.
              </p>

              <button
                type="button"
                className="mt-5 w-full rounded-full border border-[#153c33] px-5 py-3.5 text-sm font-bold hover:bg-[#153c33] hover:text-white"
              >
                BAYAR DENGAN KARTU
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
                Transfer Bank
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Virtual Account
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#707c77]">
                Nomor Virtual Account akan dibuat setelah metode
                pembayaran ini dipilih.
              </p>

              <button
                type="button"
                className="mt-5 w-full rounded-full border border-[#153c33] px-5 py-3.5 text-sm font-bold hover:bg-[#153c33] hover:text-white"
              >
                BAYAR DENGAN VA
              </button>
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
              Pesanan
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              Unit {property.block}
            </h2>

            <p className="mt-1 text-sm text-[#707c77]">
              {property.project}
            </p>

            <div className="mt-6 border-y border-black/10 py-6">
              <p className="text-sm text-[#78847f]">
                Total pembayaran
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {formatRupiah(property.price)}
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-[#faf8f0] p-4 text-xs leading-5 text-[#78847f]">
              Ini masih halaman simulasi. Payment gateway akan
              dihubungkan setelah struktur checkout dan inventory
              selesai.
            </div>

            <a
              href={`/checkout?property=${encodeURIComponent(
                params.property
              )}`}
              className="mt-6 block text-center text-sm font-semibold hover:underline"
            >
              Kembali ke checkout
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}
