import type { Metadata } from "next";
import PropertyBrowser from "@/components/PropertyBrowser";
import { getPropertiesFromDb } from "@/lib/properties-db";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Semua Unit Tersedia — Surabaya, Malang, Sidoarjo",
  description: `Daftar lengkap rumah dan ruko yang tersedia dari ${SITE.legalName}. Filter berdasarkan proyek, blok, harga, dan status. Sertifikat SHGB per kavling.`,
  alternates: { canonical: "/perumahan" },
};

export default async function PerumahanPage() {
  const properties = await getPropertiesFromDb();

  return (
    <main>
      <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">
          Perumahan
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Semua unit tersedia
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#64736d]">
          Data diperbarui langsung dari inventaris {SITE.legalName}. Unit yang
          sudah terjual otomatis tidak ditampilkan sebagai tersedia.
        </p>
      </div>

      <PropertyBrowser properties={properties} />
    </main>
  );
}
