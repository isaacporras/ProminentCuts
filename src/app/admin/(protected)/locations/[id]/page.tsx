import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { LocationForm } from "../LocationForm";
import { updateLocation } from "../actions";
import { eyebrow, pageHeading } from "../../../ui";

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const location = db.select().from(locations).where(eq(locations.id, id)).get();
  if (!location) notFound();

  return (
    <div>
      <p className={eyebrow}>Ubicaciones</p>
      <h1 className={`${pageHeading} mb-6`}>Editar ubicación</h1>
      <LocationForm location={location} action={updateLocation.bind(null, id)} />
    </div>
  );
}
