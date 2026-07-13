import { ChangePasswordForm } from "./ChangePasswordForm";
import { eyebrow, pageHeading } from "../../ui";

export default function AdminAccountPage() {
  return (
    <div>
      <p className={eyebrow}>Panel</p>
      <h1 className={`${pageHeading} mb-6`}>Cuenta</h1>
      <ChangePasswordForm />
    </div>
  );
}
