import Image from "next/image";
import Link from "next/link";
import { db } from "@/db/client";
import { providers } from "@/db/schema";
import { deleteProvider } from "./actions";
import { DeleteButton } from "../DeleteButton";
import { buttonPrimary, cardBase, eyebrow, pageHeading } from "../../ui";

export default async function AdminProvidersPage() {
  const rows = db.select().from(providers).all();

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className={eyebrow}>Panel</p>
          <h1 className={pageHeading}>Equipo</h1>
        </div>
        <Link href="/admin/providers/new" className={buttonPrimary}>
          Agregar
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className={`${cardBase} px-6 py-10 text-center`}>
          <p className="text-sm text-text/55">Todavía no hay nadie en el equipo.</p>
          <Link
            href="/admin/providers/new"
            className="mt-3 inline-block text-sm font-semibold text-secondary hover:underline"
          >
            Agregar al primero
          </Link>
        </div>
      ) : (
        <div className={`${cardBase} divide-y divide-primary/10`}>
          {rows.map((provider) => (
            <div key={provider.id} className="flex items-center gap-4 px-5 py-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-secondary/30">
                {provider.photoUrl ? (
                  <Image src={provider.photoUrl} alt="" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/5 font-heading text-sm text-primary/40">
                    {provider.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading font-semibold text-primary">
                  {provider.name}
                </p>
                <p className="truncate text-sm text-text/55">{provider.role}</p>
              </div>
              <Link
                href={`/admin/providers/${provider.id}`}
                className="shrink-0 text-sm font-medium text-secondary hover:underline"
              >
                Editar
              </Link>
              <DeleteButton action={deleteProvider.bind(null, provider.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
