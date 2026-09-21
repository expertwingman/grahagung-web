import type { Metadata } from "next";
import Link from "next/link";
import { getProjectSummaries } from "@/lib/properties-db";
import { PROJECTS } from "@/lib/projects-info";
import { projectPath, formatRupiahSingkat } from "@/lib/property-utils";
import { SITE, waLink } from "@/lib/site";
import { getProjectCover } from "@/lib/photos-db";
import CoverImage from "@/components/CoverImage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

const langkah = [
  {
    nomor: "01",
    judul: "Pilih proyek dan unit",
    teks: "Lihat lokasi, fasilitas, denah, dan daftar unit yang masih tersedia.",
  },
  {
    nomor: "02",
    judul: "Hubungi sales",
    teks: "Tanya lewat WhatsApp atau ajukan pembelian dari halaman unit. Tim kami menghubungi Anda.",
  },
  {
    nomor: "03",
    judul: "Survei dan tanda jadi",
    teks: "Kunjungi lokasi, pastikan pilihan Anda, lalu lakukan tanda jadi untuk mengunci unit.",
  },
  {
    nomor: "04",
    judul: "Pelunasan dan AJB",
    teks: "Pelunasan dan penandatanganan akta dilakukan bersama notaris. Sertifikat SHGB atas nama Anda.",
  },
];

export default async function Home() {
  const ringkasan = await getProjectSummaries();
  const totalTersedia = ringkasan.reduce((a, p) => a + p.available, 0);
  const sampul = Object.fromEntries(
    await Promise.all(ringkasan.map(async (p) => [p.slug, await getProjectCover(p.slug)] as const))
  );
  const heroFoto = sampul["wisata-semanggi"] ?? null;

  return (
    <main>
      {/* HERO */}
      <section className="bg-[#153c33] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d9c994]">
              Langsung dari developer
            </p>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Rumah dan ruko siap huni di Surabaya, Malang, dan Sidoarjo.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
              {totalTersedia} unit bersertifikat SHGB tersedia hari ini.
              Lihat denah, harga, dan siteplan — lalu hubungi sales kami
              tanpa perantara.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/perumahan"
                className="rounded-full bg-[#d9c994] px-7 py-3.5 text-sm font-bold text-[#153c33] transition hover:bg-white"
              >
                Lihat semua unit
              </Link>

              <a
                href={waLink("Halo, saya tertarik dengan properti Graha Agung Kencana Group.")}
                target="_blank"
                rel="noopener"
                className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold transition hover:border-white"
              >
                Chat sales
              </a>
            </div>
          </div>

          <div className="flex items-center">
            <CoverImage
              photo={heroFoto}
              alt="Wisata Semanggi, Surabaya Timur"
              priority
              className="aspect-[4/3] w-full rounded-[2rem]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-8 bottom-8">
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">
                  Wisata Semanggi
                </p>
                <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                  Lifestyle &amp; Green Living
                </h2>
                <p className="mt-3 text-sm text-white/70">Surabaya Timur</p>
              </div>
            </CoverImage>
          </div>
        </div>
      </section>

      {/* PROYEK */}
      <section id="proyek" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">
            Perumahan
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Tiga lokasi, satu developer
          </h2>
          <p className="mt-5 text-base leading-7 text-[#64736d]">
            Seluruh unit dijual langsung oleh {SITE.legalName}. Harga dan
            ketersediaan diperbarui dari data internal kami.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {ringkasan.map((p) => {
            const info = PROJECTS[p.slug];
            return (
              <article
                key={p.slug}
                className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={projectPath(p.name)} className="block">
                  <CoverImage
                    photo={sampul[p.slug] ?? null}
                    alt={p.name}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="aspect-[4/3]"
                  >
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-6">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#153c33]">
                        {p.available} unit tersedia
                      </span>
                    </div>
                  </CoverImage>
                </Link>

                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">
                    {info?.area ?? p.city}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">
                    <Link href={projectPath(p.name)}>{p.name}</Link>
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#6a7772]">
                    {info?.tagline}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-y border-black/10 py-4">
                    <div>
                      <p className="text-xs text-[#89938f]">Tersedia</p>
                      <p className="mt-1 text-sm font-semibold">{p.available} unit</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#89938f]">Harga mulai</p>
                      <p className="mt-1 text-sm font-semibold">
                        {formatRupiahSingkat(p.minPrice)}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={projectPath(p.name)}
                    className="mt-6 block w-full rounded-full bg-[#153c33] px-5 py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#285a4d]"
                  >
                    Lihat proyek
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CARA MEMBELI */}
      <section id="cara-membeli" className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">
              Cara membeli
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Jelas dari awal sampai serah terima
            </h2>
            <p className="mt-5 text-base leading-7 text-[#64736d]">
              Tidak ada biaya tersembunyi. Setiap tahap didampingi tim kami
              dan notaris rekanan.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {langkah.map((s) => (
              <div key={s.nomor} className="rounded-[1.5rem] border border-black/10 p-6">
                <div className="text-sm font-bold text-[#927845]">{s.nomor}</div>
                <h3 className="mt-8 text-xl font-semibold">{s.judul}</h3>
                <p className="mt-3 text-sm leading-6 text-[#6a7772]">{s.teks}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/cara-membeli" className="text-sm font-semibold text-[#153c33] underline-offset-4 hover:underline">
              Selengkapnya tentang proses pembelian dan pertanyaan umum →
            </Link>
          </div>
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">
              {SITE.name}
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Developer dengan legalitas jelas.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#64736d]">
              Setiap unit yang kami jual sudah bersertifikat SHGB per kavling.
              Anda berurusan langsung dengan {SITE.legalName} — tanpa agen,
              tanpa perantara, dengan proses yang bisa dipantau sejak tanda
              jadi sampai serah terima.
            </p>
            <Link href="/tentang" className="mt-6 inline-block text-sm font-semibold underline-offset-4 hover:underline">
              Tentang perusahaan →
            </Link>
          </div>

          <div className="rounded-[2rem] bg-[#153c33] p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d9c994]">
              Saat ini
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-4xl font-semibold">{ringkasan.length}</p>
                <p className="mt-1 text-sm text-white/60">Proyek aktif</p>
              </div>
              <div>
                <p className="text-4xl font-semibold">{totalTersedia}</p>
                <p className="mt-1 text-sm text-white/60">Unit tersedia</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
