import { ServiceForm } from "../ServiceForm";
import { createService } from "../actions";
import { eyebrow, pageHeading } from "../../../ui";

export default function NewServicePage() {
  return (
    <div>
      <p className={eyebrow}>Servicios</p>
      <h1 className={`${pageHeading} mb-6`}>Agregar servicio</h1>
      <ServiceForm action={createService} />
    </div>
  );
}
