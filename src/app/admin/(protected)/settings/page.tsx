import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { SettingsForm } from "./SettingsForm";
import { eyebrow, pageHeading } from "../../ui";

export default async function AdminSettingsPage() {
  const row = db.select().from(settings).where(eq(settings.id, "main")).get();

  return (
    <div>
      <p className={eyebrow}>Panel</p>
      <h1 className={`${pageHeading} mb-6`}>Configuración</h1>
      <SettingsForm settings={row} />
    </div>
  );
}
