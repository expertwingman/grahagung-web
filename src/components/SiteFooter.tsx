import Link from "next/link";
import { NAV, SITE, waLink } from "@/lib/site";

export default function SiteFooter() {
  const tahun = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-[#153c33] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.34em] text-white/60">
            GRAHA AGUNG
          </div>
          <div className="text-xl font-bold tracking-tight">KENCANA GROUP</div>

          <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
            {SITE.legalName}. Developer rumah tinggal dan ruko bersertifikat
            SHGB di Surabaya, Malang, dan Sidoarjo — dijual langsung tanpa
            perantara.
          </p>

          <address className="mt-6 text-sm not-italic leading-7 text-white/70">
            {SITE.address.street}
            <br />
            {SITE.address.district}, {SITE.address.city}
            <br />
            <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="hover:text-white">
              {SITE.phone}
            </a>
            {" · "}
            <a href={`tel:${SITE.phoneAlt.replace(/-/g, "")}`} className="hover:text-white">
              {SITE.phoneAlt}
            </a>
          </address>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9c994]">
            Jelajahi
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/80 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9c994]">
            Hubungi kami
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener"
                className="text-white/80 hover:text-white"
              >
                WhatsApp Sales
              </a>
            </li>
            <li>
              <a href={SITE.social.instagram} target="_blank" rel="noopener" className="text-white/80 hover:text-white">
                Instagram
              </a>
            </li>
            <li>
              <a href={SITE.social.tiktok} target="_blank" rel="noopener" className="text-white/80 hover:text-white">
                TikTok
              </a>
            </li>
          </ul>

          <p className="mt-6 text-xs leading-6 text-white/50">
            Jam layanan: Senin–Sabtu, 08.00–17.00 WIB
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© {tahun} {SITE.legalName}. Seluruh hak cipta dilindungi.</p>
          <p>Harga dan ketersediaan dapat berubah tanpa pemberitahuan.</p>
        </div>
      </div>
    </footer>
  );
}
