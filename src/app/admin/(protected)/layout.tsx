import { requireSession } from "@/lib/auth";
import { siteConfig } from "@/config/site.config";
import { AdminNav } from "./AdminNav";
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
    <div className="min-h-screen bg-bg md:flex">
      <aside className="bg-primary px-5 py-4 md:flex md:w-56 md:shrink-0 md:flex-col md:justify-between md:px-6 md:py-10">
        <div>
          <div className="flex items-center justify-between md:block">
            <div>
              <p className="font-heading text-base font-semibold text-bg md:text-lg">
                {siteConfig.business.name}
              </p>
              <p className="mt-0.5 text-[10px] tracking-[0.2em] text-bg/40 uppercase">Panel</p>
            </div>
            <div className="md:hidden">
              <LogoutButton />
            </div>
          </div>
          <AdminNav className="mt-4 flex gap-5 overflow-x-auto md:mt-8 md:flex-col md:gap-1 md:overflow-visible" />
        </div>
        <div className="hidden md:block">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 px-6 py-8 md:px-12 md:py-12">
        <div className="mx-auto max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
