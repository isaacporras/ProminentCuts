import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { providers } from "@/db/schema";
import { ProviderForm } from "../ProviderForm";
import { updateProvider } from "../actions";

export default async function EditProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = db.select().from(providers).where(eq(providers.id, id)).get();
  if (!provider) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-primary">Editar {provider.name}</h1>
      <ProviderForm provider={provider} action={updateProvider.bind(null, id)} />
    </div>
  );
}
