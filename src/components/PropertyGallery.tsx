"use client";

import { useMemo, useState } from "react";

type PropertyGalleryProps = {
  slug: string;
  project: string;
  block: string;
};

export default function PropertyGallery({
  slug,
  project,
  block,
}: PropertyGalleryProps) {
  const images = useMemo(
    () => [
      `/assets/properties/${slug}/01.jpg`,
      `/assets/properties/${slug}/02.jpg`,
      `/assets/properties/${slug}/03.jpg`,
      `/assets/properties/${slug}/04.jpg`,
      `/assets/properties/${slug}/05.jpg`,
    ],
    [slug]
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(
    new Set()
  );

  function markImageFailed(index: number) {
    setFailedImages((current) => {
      const next = new Set(current);
      next.add(index);
      return next;
    });
  }

  const hasImage = (index: number) =>
    !failedImages.has(index);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
      {/* MAIN IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#edf1ee]">
        {hasImage(selectedImage) ? (
          <img
            src={images[selectedImage]}
            alt={`${project} Unit ${block} - Foto ${selectedImage + 1}`}
            className="h-full w-full object-cover"
            onError={() => markImageFailed(selectedImage)}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                🏠
              </div>

              <p className="mt-4 text-sm font-semibold text-[#153c33]">
                Foto Unit {block}
              </p>

              <p className="mt-1 text-xs leading-5 text-[#71807a]">
                Foto properti akan ditambahkan.
              </p>
            </div>
          </div>
        )}

        {/* COUNTER */}
        <div className="absolute bottom-4 right-4 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="grid grid-cols-5 gap-2 border-t border-black/10 bg-white p-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition ${
              selectedImage === index
                ? "border-[#153c33]"
                : "border-transparent hover:border-[#b9c5bf]"
            }`}
          >
            {hasImage(index) ? (
              <img
                src={image}
                alt={`${project} Unit ${block} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
                onError={() => markImageFailed(index)}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#edf1ee] text-xs text-[#71807a]">
                Foto {index + 1}
              </div>
            )}

            {selectedImage === index && (
              <span className="absolute inset-0 border-2 border-[#153c33]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
