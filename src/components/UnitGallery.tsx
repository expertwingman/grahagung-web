"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/photos-db";

/**
 * Galeri di halaman unit: foto besar + strip thumbnail.
 * Menampilkan foto TIPE rumah unit tersebut (render, denah, interior).
 * Kalau belum ada foto, tampilkan kartu spesifikasi yang rapi.
 */
export default function UnitGallery({
  photos,
  typeName,
  project,
  block,
  floor,
  lb,
  lt,
}: {
  photos: Photo[];
  typeName: string | null;
  project: string;
  block: string;
  floor: string;
  lb: number;
  lt: number | null;
}) {
  const [aktif, setAktif] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white p-8 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
          {typeName ? `Tipe ${typeName}` : "Spesifikasi"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#153c33]">
          {lb}/{lt ?? "-"} m² · {floor}
        </h2>
        <p className="mt-2 text-sm text-[#71807a]">
          Unit {block}, {project}
        </p>
        <p className="mt-6 text-sm leading-6 text-[#71807a]">
          Foto tipe ini sedang disiapkan. Hubungi sales untuk melihat rumah contoh
          atau menjadwalkan survei lokasi.
        </p>
      </div>
    );
  }

  const utama = photos[aktif];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white">
      <div className="relative aspect-[4/3] bg-[#e6e9e3]">
        <Image
          key={utama.id}
          src={utama.url}
          alt={utama.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className={utama.category === "denah" ? "object-contain p-4" : "object-cover"}
        />
        <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
          {aktif + 1} / {photos.length}
        </span>
        {utama.caption && (
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#153c33]">
            {utama.caption}
          </span>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setAktif(i)}
              aria-label={p.alt}
              aria-current={i === aktif}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 ${
                i === aktif ? "border-[#153c33]" : "border-transparent"
              }`}
            >
              <Image src={p.url} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
