import { ProviderForm } from "../ProviderForm";
import { createProvider } from "../actions";

export default function NewProviderPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-primary">Agregar al equipo</h1>
      <ProviderForm action={createProvider} />
    </div>
  );
}
