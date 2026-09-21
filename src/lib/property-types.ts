// Tipe properti yang dipakai bersama server & client.
// File ini TIDAK boleh mengimpor apa pun dari server.

export type PropertyStatus =
  | "AVAILABLE"
  | "PRICE_PENDING"
  | "PURCHASE_IN_PROGRESS"
  | "SOLD";

export type Property = {
  id: string;
  project: string;
  location: string;
  block: string;
  shgb: string | null;
  floor: string;
  buildingArea: number;
  landArea: number | null;
  price: number | null;
  status: PropertyStatus;
  typeSlug: string | null;
  typeName: string | null;
};
