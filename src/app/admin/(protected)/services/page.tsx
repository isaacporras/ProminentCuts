import Link from "next/link";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { deleteService } from "./actions";
import { DeleteButton } from "../DeleteButton";
import { buttonPrimary } from "../../ui";

export default async function AdminServicesPage() {
  const rows = db.select().from(services).all();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Servicios</h1>
        <Link href="/admin/services/new" className={buttonPrimary}>
          Agregar
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-primary/10">
        {rows.length === 0 && (
          <p className="py-6 text-sm text-text/50">Todavía no hay servicios.</p>
        )}
        {rows.map((service) => (
          <div key={service.id} className="flex items-center gap-4 py-4">
            <div className="flex-1">
              <p className="font-semibold text-primary">{service.name}</p>
              <p className="text-sm text-text/60">
                {service.price} {service.durationMinutes && `· ${service.durationMinutes} min`}
              </p>
            </div>
            <Link
              href={`/admin/services/${service.id}`}
              className="text-sm font-medium text-secondary hover:underline"
            >
              Editar
            </Link>
            <DeleteButton action={deleteService.bind(null, service.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
