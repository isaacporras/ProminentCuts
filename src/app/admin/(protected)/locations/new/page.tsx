import { LocationForm } from "../LocationForm";
import { createLocation } from "../actions";
import { eyebrow, pageHeading } from "../../../ui";

export default function NewLocationPage() {
  return (
    <div>
      <p className={eyebrow}>Ubicaciones</p>
      <h1 className={`${pageHeading} mb-6`}>Agregar ubicación</h1>
      <LocationForm action={createLocation} />
    </div>
  );
}
