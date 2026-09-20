import type { Metadata } from "next";
import Link from "next/link";
import { SITE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cara Membeli Rumah Langsung dari Developer",
  description:
    "Proses pembelian rumah di Graha Agung Kencana Group: pilih unit, survei, tanda jadi, pelunasan bersama notaris, serah terima. Tanpa perantara, tanpa biaya tersembunyi.",
  alternates: { canonical: "/cara-membeli" },
};

const tahap = [
  { judul: "Pilih unit", teks: "Lihat proyek, denah, siteplan, dan daftar unit tersedia di website ini. Setiap unit menampilkan blok, nomor SHGB, luas, dan harga." },
  { judul: "Hubungi sales", teks: "Ajukan pembelian dari halaman unit atau chat WhatsApp. Sales kami menghubungi Anda dalam 1×24 jam kerja." },
  { judul: "Survei lokasi", teks: "Kunjungi kawasan dan lihat unit secara langsung bersama sales. Tidak ada kewajiban apa pun pada tahap ini." },
  { judul: "Tanda jadi", teks: "Setelah yakin, lakukan tanda jadi untuk mengunci unit atas nama Anda. Unit langsung ditandai tidak tersedia untuk pembeli lain." },
  { judul: "Pelunasan & PPJB", teks: "Pelunasan dilakukan ke rekening resmi perusahaan, dilanjutkan penandatanganan PPJB di hadapan notaris rekanan." },
  { judul: "AJB & serah terima", teks: "Akta Jual Beli ditandatangani di hadapan PPAT, sertifikat SHGB dibalik nama, dan kunci diserahkan." },
];

const faq = [
  { t: "Apakah bisa KPR?", j: "Saat ini penjualan dilakukan secara tunai bertahap (tanda jadi lalu pelunasan). Untuk skema pembiayaan lain, hubungi sales kami." },
  { t: "Sertifikatnya apa?", j: "Seluruh unit bersertifikat SHGB per kavling atas nama perusahaan, dibalik nama ke pembeli setelah AJB." },
  { t: "Apakah harga di website sudah final?", j: "Harga di website adalah harga jual unit. Biaya notaris, BPHTB, dan balik nama dijelaskan sales sebelum tanda jadi — tidak ada biaya tersembunyi." },
  { t: "Bagaimana jika saya membatalkan setelah tanda jadi?", j: "Ketentuan pembatalan dan pengembalian dana mengikuti syarat dan ketentuan yang disepakati saat tanda jadi. Sales kami menjelaskannya secara tertulis sebelum Anda membayar." },
  { t: "Apakah rumahnya sudah jadi?", j: "Sebagian unit sudah terbangun, sebagian masih tahap pembangunan. Status tiap unit dijelaskan sales dan bisa dilihat saat survei." },
];

export default function CaraMembeliPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.t,
      acceptedAnswer: { "@type": "Answer", text: f.j },
    })),
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">Cara membeli</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Enam tahap, semuanya jelas
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[#64736d]">
        Anda berurusan langsung dengan {SITE.legalName}. Setiap tahap didampingi
        sales dan notaris rekanan.
      </p>

      <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tahap.map((t, i) => (
          <li key={t.judul} className="rounded-[1.5rem] border border-black/10 bg-white p-6">
            <div className="text-sm font-bold text-[#927845]">{String(i + 1).padStart(2, "0")}</div>
            <h2 className="mt-6 text-xl font-semibold">{t.judul}</h2>
            <p className="mt-3 text-sm leading-6 text-[#6a7772]">{t.teks}</p>
          </li>
        ))}
      </ol>

      <section className="mt-16">
        <h2 className="text-3xl font-semibold tracking-tight">Pertanyaan umum</h2>
        <dl className="mt-6 divide-y divide-black/10 rounded-[1.5rem] border border-black/10 bg-white">
          {faq.map((f) => (
            <div key={f.t} className="px-6 py-5">
              <dt className="font-semibold">{f.t}</dt>
              <dd className="mt-2 text-sm leading-6 text-[#6a7772]">{f.j}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/perumahan" className="rounded-full bg-[#153c33] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#285a4d]">
          Lihat unit tersedia
        </Link>
        <a href={waLink("Halo, saya ingin bertanya soal proses pembelian.")} target="_blank" rel="noopener" className="rounded-full border border-[#153c33] px-7 py-3.5 text-sm font-semibold hover:bg-[#153c33] hover:text-white">
          Tanya sales
        </a>
      </div>
    </main>
  );
}
