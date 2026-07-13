import { ServiceForm } from "../ServiceForm";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-primary">Agregar servicio</h1>
      <ServiceForm action={createService} />
    </div>
  );
}
