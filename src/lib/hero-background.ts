import fs from "node:fs";
import path from "node:path";
import type { SectionBackground } from "@/types/site-config";

const BACKGROUNDS_DIR = path.join(process.cwd(), "public", "brand", "backgrounds");
const EXTENSIONS = ["webp", "jpg", "jpeg", "png"];

function findFile(baseName: string): string | undefined {
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(BACKGROUNDS_DIR, `${baseName}.${ext}`))) {
      return `/brand/backgrounds/${baseName}.${ext}`;
    }
  }
  return undefined;
}

// Auto-discovers hero.<ext> / hero-mobile.<ext> in public/brand/backgrounds/
// so a new business doesn't need to touch site.config.ts just to set its
// hero image — drop the file(s) in with these names and they're picked up.
// An explicitly configured `image` always wins (existing businesses that
// already set a custom path keep working unchanged).
export function resolveHeroBackground(configured?: SectionBackground): SectionBackground | undefined {
  const image = configured?.image ?? findFile("hero");
  if (!image) return configured;

  return {
    ...configured,
    image,
    imageMobile: configured?.imageMobile ?? findFile("hero-mobile"),
  };
}
