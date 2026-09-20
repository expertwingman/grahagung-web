import Link from "next/link";
import { NAV, SITE, waLink } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f3ec]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link href="/" className="shrink-0" aria-label="Beranda">
          <div className="text-[10px] font-semibold tracking-[0.34em] text-[#6c806f]">
            GRAHA AGUNG
          </div>
          <div className="text-lg font-bold tracking-tight text-[#153c33]">
            KENCANA GROUP
          </div>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 text-sm font-medium text-[#153c33] md:flex"
        >
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:opacity-60">
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={waLink("Halo, saya ingin bertanya tentang properti Graha Agung Kencana Group.")}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-[#153c33] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#285a4d]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z" />
          </svg>
          <span className="hidden sm:inline">Hubungi Sales</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </div>

      {/* Navigasi mobile: baris kedua, bisa digulir */}
      <nav
        aria-label="Navigasi utama (mobile)"
        className="flex gap-5 overflow-x-auto border-t border-black/5 px-6 py-2.5 text-sm font-medium text-[#153c33] md:hidden"
      >
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0">
            {item.label}
          </Link>
        ))}
      </nav>
      <span className="sr-only">{SITE.name}</span>
    </header>
  );
}
