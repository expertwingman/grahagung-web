import PropertyBrowser from "@/components/PropertyBrowser";
import { getPropertiesFromDb } from "@/lib/properties-db";

export const dynamic = "force-dynamic";

export default async function PropertyPage() {
  const properties = await getPropertiesFromDb();

  return <PropertyBrowser properties={properties} />;
}
