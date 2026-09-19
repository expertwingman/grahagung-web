import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { propertySlug } from "@/lib/property-utils";
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
};

const KOLOM =
  "id, project, location, block, shgb, floor, building_area, land_area, price, status";

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
  };
}

/**
 * Ambil semua unit dari Supabase.
 * Dibungkus cache() supaya satu request hanya sekali query,
 * walau dipanggil dari beberapa komponen.
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

/** Satu unit berdasarkan slug. Sumbernya database, bukan file statis. */
export async function getPropertyBySlug(
  slug: string
): Promise<Property | undefined> {
  const all = await getAllProperties();
  return all.find((property) => propertySlug(property) === slug);
}

/** Unit milik satu proyek, mis. "Wisata Semanggi". */
export async function getPropertiesByProject(
  project: string
): Promise<Property[]> {
  const all = await getAllProperties();
  return all.filter((property) => property.project === project);
}
