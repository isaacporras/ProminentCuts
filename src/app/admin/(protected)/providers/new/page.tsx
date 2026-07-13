import { ProviderForm } from "../ProviderForm";
import { createProvider } from "../actions";
import { eyebrow, pageHeading } from "../../../ui";

export default function NewProviderPage() {
  return (
    <div>
      <p className={eyebrow}>Equipo</p>
      <h1 className={`${pageHeading} mb-6`}>Agregar al equipo</h1>
      <ProviderForm action={createProvider} />
    </div>
  );
}
