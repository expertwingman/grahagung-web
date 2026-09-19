const projects = [
  {
    name: "Wisata Semanggi",
    location: "Surabaya Timur",
    units: "96 unit",
    price: "Mulai Rp1,256 M",
    description:
      "Hunian premium di Surabaya Timur, dekat Ekowisata Mangrove serta akses OERR dan MERR.",
  },
  {
    name: "Wisata Bukit Sentul",
    location: "Malang",
    units: "77 unit",
    price: "Mulai Rp1,040 M",
    description:
      "Kawasan hunian dengan pilihan rumah 1 lantai, 2 lantai, serta ruko.",
  },
  {
    name: "Blukid Residence 3",
    location: "Sidoarjo",
    units: "34 unit",
    price: "Mulai Rp817 Jt",
    description:
      "Pilihan rumah 1 lantai dan 2 lantai dengan berbagai ukuran tanah dan bangunan.",
  },
];

const steps = [
  {
    number: "01",
    title: "Pilih unit",
    text: "Cari proyek dan pilih rumah yang tersedia.",
  },
  {
    number: "02",
    title: "Periksa detail",
    text: "Lihat harga, spesifikasi, ukuran tanah, dan bangunan.",
  },
  {
    number: "03",
    title: "Beli sekarang",
    text: "Lanjutkan ke checkout dan pilih metode pembayaran.",
  },
  {
    number: "04",
    title: "Pesanan diproses",
    text: "Setelah pembayaran terverifikasi, transaksi masuk ke proses berikutnya.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f3ec] text-[#153c33]">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f3ec]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <div className="text-[10px] font-semibold tracking-[0.34em] text-[#6c806f]">
              GRAHA AGUNG
            </div>
            <div className="text-lg font-bold tracking-tight">
              KENCANA GROUP
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#proyek" className="hover:opacity-60">
              Proyek
            </a>
            <a href="#cara-membeli" className="hover:opacity-60">
              Cara Membeli
            </a>
            <a href="#tentang" className="hover:opacity-60">
              Tentang
            </a>
          </nav>

          <button className="rounded-full border border-[#153c33] px-5 py-2 text-sm font-semibold hover:bg-[#153c33] hover:text-white">
            Akun Saya
          </button>
        </div>
      </header>

      <section className="bg-[#153c33] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d9c994]">
              Properti Resmi Developer
            </p>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Temukan rumah.
              <br />
              Beli langsung.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
              Pilih rumah yang tersedia, lihat seluruh detailnya, lalu lakukan
              proses pembelian melalui platform resmi Graha Agung Kencana Group.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#proyek"
                className="rounded-full bg-[#d9c994] px-7 py-3.5 text-sm font-bold text-[#153c33] hover:bg-white"
              >
                LIHAT PROPERTI
              </a>

              <a
                href="#cara-membeli"
                className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold hover:border-white"
              >
                CARA MEMBELI
              </a>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-[#285a4d]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.18),transparent_30%),linear-gradient(135deg,#6f9082,#285a4d_55%,#16372f)]" />

              <div className="absolute inset-x-8 bottom-8">
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">
                  Wisata Semanggi
                </p>
                <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                  Lifestyle &amp; Green Living
                </h2>
                <p className="mt-3 text-sm text-white/70">
                  Surabaya Timur
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proyek" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">
            Properti
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Pilih proyek Anda
          </h2>

          <p className="mt-5 text-base leading-7 text-[#64736d]">
            Tiga proyek awal dari data properti PT Graha Agung Perkasa yang
            akan menjadi inventory pertama platform.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.name}
              className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[4/3] bg-[#dfe7df]">
                <div className="flex h-full items-end bg-[linear-gradient(135deg,#adc0b3,#658277_55%,#294d43)] p-6">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#153c33]">
                    Tersedia
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927845]">
                  {project.location}
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  {project.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6a7772]">
                  {project.description}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 border-y border-black/10 py-4">
                  <div>
                    <p className="text-xs text-[#89938f]">Unit</p>
                    <p className="mt-1 text-sm font-semibold">
                      {project.units}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#89938f]">Harga</p>
                    <p className="mt-1 text-sm font-semibold">
                      {project.price}
                    </p>
                  </div>
                </div>

                {project.name === "Wisata Semanggi" ? (
                  <a
                    href="/property/wisata-semanggi"
                    className="mt-6 block w-full rounded-full bg-[#153c33] px-5 py-3.5 text-center text-sm font-bold text-white hover:bg-[#285a4d]"
                  >
                    LIHAT UNIT
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-6 w-full cursor-not-allowed rounded-full bg-[#d9ddd9] px-5 py-3.5 text-sm font-bold text-[#718078]"
                  >
                    SEGERA HADIR
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="cara-membeli" className="border-y border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">
              Cara Membeli
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Sederhana seperti e-commerce
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-[1.5rem] border border-black/10 p-6"
              >
                <div className="text-sm font-bold text-[#927845]">
                  {step.number}
                </div>

                <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-[#6a7772]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tentang" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#927845]">
              Graha Agung Kencana Group
            </p>

            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Platform penjualan properti langsung dari developer.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#64736d]">
              Website ini akan berkembang menjadi platform pembelian properti
              dengan inventory unit, checkout, pembayaran, akun pembeli,
              dokumen transaksi, dan pengelolaan pesanan.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#153c33] p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d9c994]">
              Inventory Awal
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-4xl font-semibold">3</p>
                <p className="mt-1 text-sm text-white/60">Proyek</p>
              </div>

              <div>
                <p className="text-4xl font-semibold">1.241</p>
                <p className="mt-1 text-sm text-white/60">Unit dalam data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-[#687570] sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© Graha Agung Kencana Group</p>
          <p>Property E-Commerce Platform</p>
        </div>
      </footer>
    </main>
  );
}
