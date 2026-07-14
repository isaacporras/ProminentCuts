import Link from "next/link";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { deleteLocation } from "./actions";
import { DeleteButton } from "../DeleteButton";
import { buttonPrimary, cardBase, eyebrow, pageHeading } from "../../ui";

export default async function AdminLocationsPage() {
  const rows = db.select().from(locations).orderBy(locations.sortOrder).all();

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className={eyebrow}>Panel</p>
          <h1 className={pageHeading}>Ubicaciones</h1>
        </div>
        <Link href="/admin/locations/new" className={buttonPrimary}>
          Agregar
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className={`${cardBase} px-6 py-10 text-center`}>
          <p className="text-sm text-text/55">Todavía no hay ubicaciones cargadas.</p>
          <Link
            href="/admin/locations/new"
            className="mt-3 inline-block text-sm font-semibold text-secondary hover:underline"
          >
            Agregar la primera
          </Link>
        </div>
      ) : (
        <div className={`${cardBase} divide-y divide-primary/10`}>
          {rows.map((location) => (
            <div key={location.id} className="flex items-center gap-4 px-5 py-4">
              <p className="min-w-0 flex-1 truncate text-sm text-text/80">{location.address}</p>
              <Link
                href={`/admin/locations/${location.id}`}
                className="shrink-0 text-sm font-medium text-secondary hover:underline"
              >
                Editar
              </Link>
              <DeleteButton action={deleteLocation.bind(null, location.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
