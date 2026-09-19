"use client";

import { useMemo, useState } from "react";
import { properties } from "@/lib/properties";
import { propertySlug } from "@/lib/property-utils";

type UnitStatus = "AVAILABLE" | "SOLD" | "PURCHASE_IN_PROGRESS";

type MapUnit = {
  block: string;
  status: UnitStatus;
  polygon: string;
};

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

function getBlock(propertyBlock: string) {
  return propertyBlock.split("-")[0];
}

const mapUnits: MapUnit[] = [
  {
    block: "K.1-11",
    status: "AVAILABLE",
    polygon:
      "346,150 376,148 376,184 346,186",
  },
  {
    block: "K.1-15",
    status: "AVAILABLE",
    polygon:
      "378,148 408,147 408,183 378,184",
  },
  {
    block: "K.1-17",
    status: "AVAILABLE",
    polygon:
      "410,147 440,146 440,182 410,183",
  },
  {
    block: "K.1-19",
    status: "AVAILABLE",
    polygon:
      "442,146 472,145 472,181 442,182",
  },
  {
    block: "K.1-21",
    status: "AVAILABLE",
    polygon:
      "474,145 504,144 504,180 474,181",
  },
];

function getStatusColor(status: UnitStatus) {
  if (status === "SOLD") {
    return "#dc2626";
  }

  if (status === "PURCHASE_IN_PROGRESS") {
    return "#927845";
  }

  return "#16a34a";
}

export default function Siteplan() {
  const [selectedBlock, setSelectedBlock] = useState("ALL");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const projectProperties = properties.filter(
    (property) => property.project === "Wisata Semanggi"
  );

  const blocks = useMemo(() => {
    return Array.from(
      new Set(projectProperties.map((property) => getBlock(property.block)))
    ).sort();
  }, [projectProperties]);

  const filteredProperties = useMemo(() => {
    return projectProperties.filter((property) => {
      if (selectedBlock === "ALL") {
        return true;
      }

      return getBlock(property.block) === selectedBlock;
    });
  }, [projectProperties, selectedBlock]);

  const selectedProperty = selectedUnit
    ? projectProperties.find(
        (property) => property.block === selectedUnit
      )
    : null;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside
        className="
          h-fit
          max-h-[65vh]
          overflow-y-auto
          overscroll-contain
          rounded-[2rem]
          border
          border-black/10
          bg-white
          p-5
          shadow-sm
          lg:sticky
          lg:top-24
          lg:max-h-[calc(100vh-7rem)]
        "
      >
        <div className="border-b border-black/10 pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
            Inventory
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Wisata Semanggi
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#78847f]">
            Pilih blok atau unit yang tersedia.
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              Blok
            </p>

            <button
              type="button"
              onClick={() => {
                setSelectedBlock("ALL");
                setSelectedUnit(null);
              }}
              className="text-xs font-semibold text-[#927845] hover:underline"
            >
              Reset
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedBlock("ALL");
                setSelectedUnit(null);
              }}
              className={`rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                selectedBlock === "ALL"
                  ? "bg-[#153c33] text-white"
                  : "bg-[#f4f3ed] text-[#153c33]"
              }`}
            >
              Semua
            </button>

            {blocks.map((block) => (
              <button
                key={block}
                type="button"
                onClick={() => {
                  setSelectedBlock(block);
                  setSelectedUnit(null);
                }}
                className={`rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                  selectedBlock === block
                    ? "bg-[#153c33] text-white"
                    : "bg-[#f4f3ed] text-[#153c33]"
                }`}
              >
                {block}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-[#f4f3ed] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#78847f]">
                Unit tersedia
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {filteredProperties.length}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="h-3 w-3 rounded-full bg-green-600" />
              Available
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filteredProperties.map((property) => {
            const mappedUnit = mapUnits.find(
              (unit) => unit.block === property.block
            );

            const status = mappedUnit?.status ?? "AVAILABLE";

            return (
              <button
                key={`${property.project}-${property.block}`}
                type="button"
                onClick={() => setSelectedUnit(property.block)}
                className={`block w-full rounded-2xl border bg-[#fbfaf6] p-4 text-left transition ${
                  selectedUnit === property.block
                    ? "border-[#153c33] bg-white shadow-sm"
                    : "border-black/10 hover:border-[#153c33] hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927845]">
                      Blok {getBlock(property.block)}
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {property.block}
                    </p>
                  </div>

                  <span
                    className="mt-1 h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor: getStatusColor(status),
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-[#78847f]">
                    {property.floor}
                  </span>

                  <span className="font-semibold text-[#36564d]">
                    {property.buildingArea}/{property.landArea} m²
                  </span>
                </div>

                <p className="mt-3 text-sm font-semibold">
                  {formatRupiah(property.price)}
                </p>

                <p className="mt-2 text-xs font-semibold text-[#153c33]">
                  Pilih unit →
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="rounded-[2rem] border border-black/10 bg-white p-3 shadow-sm">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[#153c33]">
            <img
              src="/assets/wisata-semanggi/siteplan.png"
              alt="Siteplan Wisata Semanggi"
              className="block h-auto w-full"
            />


          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-5 rounded-2xl bg-white px-5 py-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-600" />
            Available
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#927845]" />
            Purchase in progress
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-600" />
            Sold
          </div>
        </div>

        {selectedProperty && (
          <div className="mt-4 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927845]">
                  Wisata Semanggi
                </p>

                <h3 className="mt-2 text-3xl font-semibold">
                  Unit {selectedProperty.block}
                </h3>

                <p className="mt-2 text-sm text-[#78847f]">
                  {selectedProperty.floor} ·{" "}
                  {selectedProperty.buildingArea} m² bangunan ·{" "}
                  {selectedProperty.landArea} m² tanah
                </p>

                <p className="mt-4 text-2xl font-semibold">
                  {formatRupiah(selectedProperty.price)}
                </p>
              </div>

              <a
                href={`/property/${propertySlug(selectedProperty)}`}
                className="inline-flex rounded-full bg-[#153c33] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#285a4d]"
              >
                LIHAT DETAIL UNIT
              </a>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-[#d9d6c8] bg-[#faf8f0] p-5 text-sm leading-6 text-[#697771]">
          <strong className="text-[#153c33]">
            Prototype interactive siteplan.
          </strong>{" "}
          Untuk saat ini overlay interaktif baru dipasang pada sebagian unit
          Blok K.1. Setelah posisi polygon diverifikasi, pola yang sama akan
          diterapkan ke seluruh unit dan statusnya nanti dapat dikendalikan
          dari inventory/database.
        </div>
      </div>
    </div>
  );
}
