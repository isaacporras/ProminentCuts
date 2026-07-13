import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { ServiceForm } from "../ServiceForm";
import { updateService } from "../actions";
import { eyebrow, pageHeading } from "../../../ui";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = db.select().from(services).where(eq(services.id, id)).get();
  if (!service) notFound();

  return (
    <div>
      <p className={eyebrow}>Servicios</p>
      <h1 className={`${pageHeading} mb-6`}>Editar {service.name}</h1>
      <ServiceForm service={service} action={updateService.bind(null, id)} />
    </div>
  );
}
