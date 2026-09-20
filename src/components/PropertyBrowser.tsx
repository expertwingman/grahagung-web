"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DbProperty } from "@/lib/properties-db";
import { unitPath } from "@/lib/property-utils";

type PropertyStatus =
  | "AVAILABLE"
  | "PRICE_PENDING"
  | "PURCHASE_IN_PROGRESS"
  | "SOLD";

function formatRupiah(value: number | null) {
  if (value === null) {
    return "Harga belum tersedia";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

const PROJECTS = [
  {
    value: "Wisata Semanggi",
    location: "Surabaya Timur",
    siteplan: "/assets/wisata-semanggi/siteplan.png",
  },
  {
    value: "Wisata Bukit Sentul",
    location: "Malang",
    siteplan: null,
  },
  {
    value: "Blukid Residence 3",
    location: "Sidoarjo",
    siteplan: null,
  },
];

const STATUSES: {
  label: string;
  value: PropertyStatus | "ALL";
}[] = [
  { label: "Semua Status", value: "ALL" },
  { label: "Tersedia", value: "AVAILABLE" },
  { label: "Harga belum tersedia", value: "PRICE_PENDING" },
  { label: "Dalam proses", value: "PURCHASE_IN_PROGRESS" },
  { label: "Terjual", value: "SOLD" },
];

const PRICE_RANGES = [
  { label: "Semua Harga", min: null, max: null },
  { label: "Di bawah Rp1 M", min: 0, max: 999_999_999 },
  {
    label: "Rp1 M – Rp1,5 M",
    min: 1_000_000_000,
    max: 1_500_000_000,
  },
  {
    label: "Rp1,5 M – Rp2 M",
    min: 1_500_000_000,
    max: 2_000_000_000,
  },
  {
    label: "Di atas Rp2 M",
    min: 2_000_000_001,
    max: null,
  },
];

const FLOORS = [
  { label: "Semua Tipe", value: "ALL" },
  { label: "1 Lantai", value: "1 lantai" },
  { label: "2 Lantai", value: "2 lantai" },
];

function statusLabel(status: PropertyStatus) {
  switch (status) {
    case "AVAILABLE":
      return "Tersedia";
    case "PRICE_PENDING":
      return "Harga belum tersedia";
    case "PURCHASE_IN_PROGRESS":
      return "Dalam proses";
    case "SOLD":
      return "Terjual";
  }
}

function statusClass(status: PropertyStatus) {
  switch (status) {
    case "AVAILABLE":
      return "bg-emerald-50 text-emerald-800";
    case "PRICE_PENDING":
      return "bg-amber-50 text-amber-800";
    case "PURCHASE_IN_PROGRESS":
      return "bg-blue-50 text-blue-800";
    case "SOLD":
      return "bg-red-50 text-red-800";
  }
}

export default function PropertyBrowser({
  properties,
}: {
  properties: DbProperty[];
}) {
  const [project, setProject] = useState("Wisata Semanggi");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [floor, setFloor] = useState("ALL");
  const [status, setStatus] = useState<PropertyStatus | "ALL">("ALL");
  const [priceRange, setPriceRange] = useState(0);
  const [selectedPropertyBlock, setSelectedPropertyBlock] =
    useState<string | null>(null);

  const selectedProject = PROJECTS.find(
    (item) => item.value === project
  );

  const projectProperties = useMemo(() => {
    return properties
      .filter((item) => item.project === project)
      .sort((a, b) =>
        a.block.localeCompare(b.block, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      );
  }, [properties, project]);

  const selectedProperty = useMemo(() => {
    if (!selectedPropertyBlock) {
      return null;
    }

    return (
      projectProperties.find(
        (item) => item.block === selectedPropertyBlock
      ) ?? null
    );
  }, [projectProperties, selectedPropertyBlock]);

  const filteredProperties = useMemo(() => {
    const range = PRICE_RANGES[priceRange];

    return projectProperties.filter((property) => {
      const matchesUnit =
        selectedUnit === "ALL" || property.block === selectedUnit;

      const matchesFloor =
        floor === "ALL" || property.floor === floor;

      const matchesStatus =
        status === "ALL" || property.status === status;

      const matchesPrice =
        range.min === null ||
        (property.price !== null && property.price >= range.min);

      const matchesMaxPrice =
        range.max === null ||
        (property.price !== null && property.price <= range.max);

      return (
        matchesUnit &&
        matchesFloor &&
        matchesStatus &&
        matchesPrice &&
        matchesMaxPrice
      );
    });
  }, [
    projectProperties,
    selectedUnit,
    floor,
    status,
    priceRange,
  ]);

  function changeProject(value: string) {
    setProject(value);
    setSelectedUnit("ALL");
    setFloor("ALL");
    setStatus("ALL");
    setPriceRange(0);
    setSelectedPropertyBlock(null);
  }

  function clearFilters() {
    setSelectedUnit("ALL");
    setFloor("ALL");
    setStatus("ALL");
    setPriceRange(0);
  }

  const hasFilters =
    selectedUnit !== "ALL" ||
    floor !== "ALL" ||
    status !== "ALL" ||
    priceRange !== 0;

  return (
    <main className="min-h-screen bg-[#f7f8f7] text-[#153c33]">
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#48655b]">
            PROPERTY COLLECTION
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#153c33]">
            Pilih unit properti Anda
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#566762]">
            Pilih proyek, lihat posisi pada siteplan, lalu pilih unit
            yang ingin Anda lihat.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-5 lg:px-6">
        <div
          className={`grid h-[calc(100vh-185px)] min-h-[680px] overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-sm ${
            selectedProperty
              ? "lg:grid-cols-[330px_minmax(0,1fr)_350px]"
              : "lg:grid-cols-[370px_minmax(0,1fr)]"
          }`}
        >
          <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden border-b border-black/10 bg-white lg:border-b-0 lg:border-r">
            <div className="shrink-0 border-b border-black/10 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#71807a]">
                    DAFTAR UNIT
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-[#153c33]">
                    {project}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-xl font-semibold text-[#153c33]">
                    {filteredProperties.length}
                  </p>

                  <p className="text-[10px] text-[#71807a]">
                    unit
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#52635d]">
                    Proyek
                  </label>

                  <select
                    value={project}
                    onChange={(event) =>
                      changeProject(event.target.value)
                    }
                    className="w-full rounded-xl border border-[#cbd3cf] bg-white px-3.5 py-3 text-sm font-medium text-[#153c33] outline-none focus:border-[#153c33] focus:ring-2 focus:ring-[#153c33]/10"
                  >
                    {PROJECTS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#52635d]">
                    Unit
                  </label>

                  <select
                    value={selectedUnit}
                    onChange={(event) =>
                      setSelectedUnit(event.target.value)
                    }
                    className="w-full rounded-xl border border-[#cbd3cf] bg-white px-3.5 py-3 text-sm font-medium text-[#153c33] outline-none focus:border-[#153c33] focus:ring-2 focus:ring-[#153c33]/10"
                  >
                    <option value="ALL">Semua Unit</option>

                    {projectProperties.map((item) => (
                      <option key={item.block} value={item.block}>
                        {item.block}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#52635d]">
                      Tipe
                    </label>

                    <select
                      value={floor}
                      onChange={(event) =>
                        setFloor(event.target.value)
                      }
                      className="w-full rounded-xl border border-[#cbd3cf] bg-white px-3 py-3 text-sm font-medium text-[#153c33] outline-none focus:border-[#153c33]"
                    >
                      {FLOORS.map((item) => (
                        <option
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#52635d]">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value as
                            | PropertyStatus
                            | "ALL"
                        )
                      }
                      className="w-full rounded-xl border border-[#cbd3cf] bg-white px-3 py-3 text-sm font-medium text-[#153c33] outline-none focus:border-[#153c33]"
                    >
                      {STATUSES.map((item) => (
                        <option
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#52635d]">
                    Harga
                  </label>

                  <select
                    value={priceRange}
                    onChange={(event) =>
                      setPriceRange(Number(event.target.value))
                    }
                    className="w-full rounded-xl border border-[#cbd3cf] bg-white px-3.5 py-3 text-sm font-medium text-[#153c33] outline-none focus:border-[#153c33]"
                  >
                    {PRICE_RANGES.map((item, index) => (
                      <option key={item.label} value={index}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-bold text-[#153c33] underline underline-offset-4"
                  >
                    Reset filter
                  </button>
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#fafbfa] p-4">
              <div className="space-y-3">
                {filteredProperties.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-center">
                    <p className="text-sm font-semibold text-[#153c33]">
                      Tidak ada unit
                    </p>

                    <p className="mt-2 text-xs text-[#667771]">
                      Silakan ubah filter.
                    </p>
                  </div>
                ) : (
                  filteredProperties.map((property) => {
                    const isSelected =
                      selectedPropertyBlock === property.block;

                    return (
                      <article
                        key={`${property.project}-${property.block}`}
                        className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
                          isSelected
                            ? "border-[#153c33] ring-2 ring-[#153c33]/10"
                            : "border-black/10 hover:border-[#153c33]/25 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#71807a]">
                              UNIT
                            </p>

                            <h3 className="mt-1 text-lg font-semibold text-[#153c33]">
                              {property.block}
                            </h3>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass(
                              property.status
                            )}`}
                          >
                            {statusLabel(property.status)}
                          </span>
                        </div>

                        <p className="mt-3 text-sm font-semibold text-[#153c33]">
                          {formatRupiah(property.price)}
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPropertyBlock(property.block);
                            setSelectedUnit(property.block);
                          }}
                          className={`mt-4 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-xs font-bold transition ${
                            isSelected
                              ? "bg-[#285a4d] text-white"
                              : "bg-[#153c33] text-white hover:bg-[#285a4d]"
                          }`}
                        >
                          LIHAT UNIT
                        </button>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          <section className="relative min-h-0 overflow-hidden bg-[#eef2ef]">
            <div className="absolute left-5 top-5 z-10 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#153c33] shadow-sm">
              SITEPLAN
            </div>

            <div className="flex h-full min-h-0 items-center justify-center p-5 pt-16 md:p-7">
              {selectedProject?.siteplan ? (
                <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
                  <img
                    src={selectedProject.siteplan}
                    alt={`Siteplan ${selectedProject.value}`}
                    className="block max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="max-w-sm px-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                    🗺️
                  </div>

                  <h2 className="mt-5 text-xl font-semibold text-[#153c33]">
                    Siteplan belum tersedia
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#667771]">
                    Siteplan {selectedProject?.value} akan
                    ditambahkan setelah gambar final tersedia.
                  </p>
                </div>
              )}
            </div>
          </section>

          {selectedProperty && (
            <aside className="min-h-0 overflow-y-auto border-t border-black/10 bg-white lg:border-l lg:border-t-0">
              <div className="p-6">
                <div className="border-b border-black/10 pb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#71807a]">
                    UNIT TERPILIH
                  </p>

                  <div className="mt-2 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-semibold text-[#153c33]">
                        {selectedProperty.block}
                      </h2>

                      <p className="mt-1 text-sm text-[#667771]">
                        {selectedProperty.project}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${statusClass(
                        selectedProperty.status
                      )}`}
                    >
                      {statusLabel(selectedProperty.status)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#71807a]">
                      Tipe
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#153c33]">
                      {selectedProperty.floor}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#71807a]">
                      Luas Bangunan
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#153c33]">
                      {selectedProperty.building_area} m²
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#71807a]">
                      Luas Tanah
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#153c33]">
                      {selectedProperty.land_area !== null
                        ? `${selectedProperty.land_area} m²`
                        : "Belum tersedia"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#71807a]">
                      SHGB
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#153c33]">
                      {selectedProperty.shgb || "Belum tersedia"}
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#71807a]">
                      Harga
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-[#153c33]">
                      {formatRupiah(selectedProperty.price)}
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-black/10 pt-6">
                  <Link
                    href={unitPath(selectedProperty)}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#153c33] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#285a4d]"
                  >
                    Lihat detail lengkap
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedPropertyBlock(null)}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[#cbd3cf] bg-white px-5 py-3.5 text-sm font-bold text-[#153c33] transition hover:bg-[#f3f5f4]"
                  >
                    TUTUP DETAIL
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 px-2 text-[10px] font-medium text-[#667771]">
          <span className="font-bold text-[#153c33]">
            Status:
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Tersedia
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            Harga belum tersedia
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Dalam proses
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Terjual
          </span>
        </div>
      </section>
    </main>
  );
}
