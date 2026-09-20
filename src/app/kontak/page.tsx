import type { Metadata } from "next";
import { SITE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: `Kantor pemasaran ${SITE.legalName} di ${SITE.address.city}. Hubungi via WhatsApp, telepon, atau kunjungi langsung.`,
  alternates: { canonical: "/kontak" },
};

export default function KontakPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">Kontak</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Hubungi kami</h1>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <a
          href={waLink()}
          target="_blank"
          rel="noopener"
          className="rounded-[1.5rem] bg-[#153c33] p-6 text-white transition hover:bg-[#285a4d]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9c994]">Tercepat</p>
          <p className="mt-3 text-xl font-semibold">WhatsApp Sales</p>
          <p className="mt-2 text-sm text-white/70">Balasan pada jam kerja, Senin–Sabtu 08.00–17.00 WIB</p>
        </a>

        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">Telepon</p>
          <p className="mt-3 text-xl font-semibold">
            <a href={`tel:${SITE.phone.replace(/-/g, "")}`}>{SITE.phone}</a>
          </p>
          <p className="mt-1 text-sm text-[#64736d]">
            <a href={`tel:${SITE.phoneAlt.replace(/-/g, "")}`}>{SITE.phoneAlt}</a>
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">Kantor pemasaran</p>
          <address className="mt-3 text-sm not-italic leading-7">
            {SITE.address.street}<br />
            {SITE.address.district}<br />
            {SITE.address.city}, {SITE.address.province}
          </address>
        </div>
      </div>

      {/* TODO: sematkan Google Maps kantor pemasaran */}
    </main>
  );
}
