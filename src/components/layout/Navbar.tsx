import { siteConfig } from "@/config/site.config";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-bg/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#acerca" className="font-heading text-lg font-bold text-primary">
          {siteConfig.business.name}
        </a>
        <ul className="flex items-center gap-4 overflow-x-auto text-sm font-medium text-text/80 sm:gap-8">
          {siteConfig.nav.map((item) => (
            <li key={item.href} className="shrink-0">
              <a href={item.href} className="transition hover:text-secondary">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
