import { createClient } from "@/lib/supabase/server";

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
  status: "AVAILABLE" | "PRICE_PENDING" | "PURCHASE_IN_PROGRESS" | "SOLD";
};

export async function getPropertiesFromDb(): Promise<DbProperty[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, project, location, block, shgb, floor, building_area, land_area, price, status"
    )
    .order("project", { ascending: true })
    .order("block", { ascending: true });

  if (error) {
    console.error("Gagal mengambil properties dari Supabase:", error);
    return [];
  }

  return data ?? [];
}
