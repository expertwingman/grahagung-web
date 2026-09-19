import { properties, type Property } from "@/lib/properties";

export function propertySlug(property: Property) {
  return `${property.project}-${property.block}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getPropertyBySlug(slug: string) {
  return properties.find(
    (property) => propertySlug(property) === slug
  );
}
