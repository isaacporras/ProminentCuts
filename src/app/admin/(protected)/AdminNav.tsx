"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/providers", label: "Equipo" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/locations", label: "Ubicaciones" },
  { href: "/admin/gallery", label: "Galería" },
  { href: "/admin/settings", label: "Configuración" },
  { href: "/admin/account", label: "Cuenta" },
];

export function AdminNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {LINKS.map(({ href, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`relative shrink-0 py-1.5 pl-4 text-sm font-medium transition ${
              active ? "text-bg" : "text-bg/50 hover:text-bg/80"
            }`}
          >
            {active && (
              <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 bg-accent" />
            )}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
