import Image from "next/image";
import Link from "next/link";
import { db } from "@/db/client";
import { providers } from "@/db/schema";
import { deleteProvider } from "./actions";
import { DeleteButton } from "../DeleteButton";
import { buttonPrimary } from "../../ui";

export default async function AdminProvidersPage() {
  const rows = db.select().from(providers).all();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Equipo</h1>
        <Link href="/admin/providers/new" className={buttonPrimary}>
          Agregar
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-primary/10">
        {rows.length === 0 && (
          <p className="py-6 text-sm text-text/50">Todavía no hay nadie en el equipo.</p>
        )}
        {rows.map((provider) => (
          <div key={provider.id} className="flex items-center gap-4 py-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-primary/10">
              {provider.photoUrl && (
                <Image src={provider.photoUrl} alt="" fill className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-primary">{provider.name}</p>
              <p className="text-sm text-text/60">{provider.role}</p>
            </div>
            <Link
              href={`/admin/providers/${provider.id}`}
              className="text-sm font-medium text-secondary hover:underline"
            >
              Editar
            </Link>
            <DeleteButton action={deleteProvider.bind(null, provider.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
