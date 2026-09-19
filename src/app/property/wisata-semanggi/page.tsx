import Siteplan from "./Siteplan";

export default function WisataSemanggiPage() {
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

          <a
            href="/property"
            className="rounded-full border border-[#153c33] px-5 py-2 text-sm font-semibold hover:bg-[#153c33] hover:text-white"
          >
            Semua Properti
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">
          Project
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Wisata Semanggi
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-[#64736d]">
          Hunian premium di kawasan Surabaya Timur, dekat Ekowisata Mangrove
          dan akses OERR serta MERR.
        </p>

        <div className="mt-10">
          <Siteplan />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
              Lokasi
            </p>

            <p className="mt-3 text-lg font-semibold">
              Surabaya Timur
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
              Konsep
            </p>

            <p className="mt-3 text-lg font-semibold">
              Lifestyle &amp; Green Living
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
              Fasilitas
            </p>

            <p className="mt-3 text-lg font-semibold">
              Club House
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
