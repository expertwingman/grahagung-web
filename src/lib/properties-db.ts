import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  propertySlug,
  projectSlug,
  blockSlug,
} from "@/lib/property-utils";
import type { Property, PropertyStatus } from "@/lib/property-types";

/** Bentuk baris apa adanya dari view public.properties (snake_case). */
export type DbProperty = {
  id: string;
  project: string;
  location: string;
  block: string;
  shgb: string | null;
  floor: string;
  building_area: number;
  land_area: number | null;
  price: number | null;
  status: PropertyStatus;
  type_slug: string | null;
  type_name: string | null;
};

const KOLOM =
  "id, project, location, block, shgb, floor, building_area, land_area, price, status, type_slug, type_name";

function toProperty(row: DbProperty): Property {
  return {
    id: row.id,
    project: row.project,
    location: row.location,
    block: row.block,
    shgb: row.shgb,
    floor: row.floor,
    buildingArea: row.building_area,
    landArea: row.land_area,
    price: row.price,
    status: row.status,
    typeSlug: row.type_slug ?? null,
    typeName: row.type_name ?? null,
  };
}

/**
 * Ambil semua unit dari Supabase.
 * Dibungkus cache() supaya satu request hanya sekali query.
 */
export const getPropertiesFromDb = cache(async (): Promise<DbProperty[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(KOLOM)
    .order("project", { ascending: true })
    .order("block", { ascending: true });

  if (error) {
    console.error("Gagal mengambil properties dari Supabase:", error);
    return [];
  }

  return (data ?? []) as DbProperty[];
});

/** Semua unit dalam bentuk camelCase yang dipakai komponen. */
export const getAllProperties = cache(async (): Promise<Property[]> => {
  const rows = await getPropertiesFromDb();
  return rows.map(toProperty);
});

/** Slug lama gabungan — hanya untuk pengalihan URL lama. */
export async function getPropertyBySlug(
  slug: string
): Promise<Property | undefined> {
  const all = await getAllProperties();
  return all.find((p) => propertySlug(p) === slug);
}

/** Unit berdasarkan slug proyek + slug blok (URL baru). */
export async function getPropertyByProjectAndBlock(
  project: string,
  block: string
): Promise<Property | undefined> {
  const all = await getAllProperties();
  return all.find(
    (p) => projectSlug(p.project) === project && blockSlug(p.block) === block
  );
}

/** Unit milik satu proyek, berdasarkan nama atau slug proyek. */
export async function getPropertiesByProject(
  projectNameOrSlug: string
): Promise<Property[]> {
  const all = await getAllProperties();
  const target = projectSlug(projectNameOrSlug);
  return all.filter((p) => projectSlug(p.project) === target);
}

export type ProjectSummary = {
  name: string;
  slug: string;
  city: string;
  total: number;
  available: number;
  minPrice: number | null;
  maxPrice: number | null;
};

/** Ringkasan per proyek: jumlah unit, tersedia, rentang harga — dari database. */
export const getProjectSummaries = cache(async (): Promise<ProjectSummary[]> => {
  const all = await getAllProperties();
  const map = new Map<string, ProjectSummary>();

  for (const p of all) {
    const key = projectSlug(p.project);
    const s = map.get(key) ?? {
      name: p.project,
      slug: key,
      city: p.location,
      total: 0,
      available: 0,
      minPrice: null,
      maxPrice: null,
    };
    s.total += 1;
    if (p.status === "AVAILABLE") s.available += 1;
    if (p.price !== null) {
      s.minPrice = s.minPrice === null ? p.price : Math.min(s.minPrice, p.price);
      s.maxPrice = s.maxPrice === null ? p.price : Math.max(s.maxPrice, p.price);
    }
    map.set(key, s);
  }

  return Array.from(map.values());
});
