import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: middleware already gates /admin/*, but every
  // protected page re-checks its own session too.
  await requireSession();

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between border-b border-primary/10 pb-4">
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/admin/providers" className="text-primary hover:text-secondary">
            Equipo
          </Link>
          <Link href="/admin/services" className="text-primary hover:text-secondary">
            Servicios
          </Link>
          <Link href="/admin/account" className="text-primary hover:text-secondary">
            Cuenta
          </Link>
        </nav>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
