"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Photo } from "@/lib/photos-db";

/**
 * Grid foto dengan lightbox sederhana.
 * Dipakai di halaman galeri, proyek, dan tipe.
 */
export default function PhotoGrid({
  photos,
  columns = 3,
}: {
  photos: Photo[];
  columns?: 2 | 3 | 4;
}) {
  const [aktif, setAktif] = useState<number | null>(null);

  useEffect(() => {
    if (aktif === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAktif(null);
      if (e.key === "ArrowRight") setAktif((i) => (i === null ? null : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setAktif((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [aktif, photos.length]);

  if (photos.length === 0) return null;

  const kolom = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];

  return (
    <>
      <ul className={`grid gap-3 ${kolom}`}>
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setAktif(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#e6e9e3]"
              aria-label={`Perbesar: ${p.alt}`}
            >
              <Image
                src={p.url}
                alt={p.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              {p.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8 text-left text-xs text-white">
                  {p.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {aktif !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[aktif].alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setAktif(null)}
        >
          <button
            type="button"
            onClick={() => setAktif(null)}
            aria-label="Tutup"
            className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Tutup
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setAktif((aktif - 1 + photos.length) % photos.length); }}
                aria-label="Sebelumnya"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white hover:bg-white/20"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setAktif((aktif + 1) % photos.length); }}
                aria-label="Berikutnya"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white hover:bg-white/20"
              >
                ›
              </button>
            </>
          )}

          <figure className="max-h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-[80vh] w-[92vw] max-w-6xl">
              <Image
                src={photos[aktif].url}
                alt={photos[aktif].alt}
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {photos[aktif].caption ?? photos[aktif].alt}
              <span className="ml-3 text-white/40">{aktif + 1} / {photos.length}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
