import Link from "next/link";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { deleteService } from "./actions";
import { DeleteButton } from "../DeleteButton";
import { buttonPrimary, cardBase, eyebrow, pageHeading } from "../../ui";

export default async function AdminServicesPage() {
  const rows = db.select().from(services).all();

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className={eyebrow}>Panel</p>
          <h1 className={pageHeading}>Servicios</h1>
        </div>
        <Link href="/admin/services/new" className={buttonPrimary}>
          Agregar
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className={`${cardBase} px-6 py-10 text-center`}>
          <p className="text-sm text-text/55">Todavía no hay servicios.</p>
          <Link
            href="/admin/services/new"
            className="mt-3 inline-block text-sm font-semibold text-secondary hover:underline"
          >
            Agregar el primero
          </Link>
        </div>
      ) : (
        <div className={`${cardBase} divide-y divide-primary/10`}>
          {rows.map((service) => (
            <div key={service.id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading font-semibold text-primary">{service.name}</p>
                <p className="text-sm text-text/55">
                  {service.price} {service.durationMinutes && `· ${service.durationMinutes} min`}
                </p>
              </div>
              <Link
                href={`/admin/services/${service.id}`}
                className="shrink-0 text-sm font-medium text-secondary hover:underline"
              >
                Editar
              </Link>
              <DeleteButton action={deleteService.bind(null, service.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
