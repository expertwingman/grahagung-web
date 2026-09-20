import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tentang Graha Agung Kencana Group",
  description: `${SITE.legalName} adalah developer properti di Jawa Timur dengan proyek di Surabaya, Malang, dan Sidoarjo. Seluruh unit bersertifikat SHGB per kavling.`,
  alternates: { canonical: "/tentang" },
};

export default function TentangPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">Tentang</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
        {SITE.name}
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5 text-base leading-8 text-[#3d4b46]">
          <p>
            {SITE.legalName} adalah pengembang properti yang berkantor di Surabaya
            dan mengembangkan kawasan hunian di Jawa Timur: Wisata Semanggi di
            Surabaya Timur, Wisata Bukit Sentul di Malang, dan Blukid Residence 3
            di Sidoarjo.
          </p>
          <p>
            Kami menjual langsung kepada pembeli tanpa agen perantara. Setiap unit
            yang ditawarkan sudah memiliki sertifikat SHGB per kavling, dan seluruh
            proses — dari tanda jadi sampai AJB — dilakukan bersama notaris rekanan.
          </p>
          {/* TODO: sejarah singkat, tahun berdiri, jumlah unit terbangun,
              foto kantor & tim. Minta ke manajemen. */}
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.5rem] border border-black/10 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">Legalitas</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>✓ Sertifikat SHGB per kavling</li>
              <li>✓ Transaksi melalui notaris & PPAT</li>
              <li>✓ Pembayaran ke rekening resmi perusahaan</li>
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-black/10 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">Kantor pemasaran</p>
            <address className="mt-4 text-sm not-italic leading-7 text-[#3d4b46]">
              {SITE.address.street}<br />
              {SITE.address.district}<br />
              {SITE.address.city}, {SITE.address.province}<br />
              {SITE.phone} · {SITE.phoneAlt}
            </address>
          </div>
        </aside>
      </div>

      <div className="mt-12">
        <Link href="/perumahan" className="text-sm font-semibold underline-offset-4 hover:underline">
          Lihat proyek kami →
        </Link>
      </div>
    </main>
  );
}
