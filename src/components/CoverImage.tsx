import Image from "next/image";
import type { Photo } from "@/lib/photos-db";

/**
 * Gambar sampul untuk kartu & hero.
 * Kalau foto belum ada, tampilkan latar gradasi yang rapi — bukan kotak rusak.
 */
export default function CoverImage({
  photo,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  children,
}: {
  photo: Photo | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#294d43] ${className}`}>
      {photo ? (
        <Image
          src={photo.url}
          alt={photo.alt || alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.18),transparent_30%),linear-gradient(135deg,#6f9082,#285a4d_55%,#16372f)]" />
      )}
      {children}
    </div>
  );
}
