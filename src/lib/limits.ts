// Plain constants shared between "use server" action files (which can only
// export async functions, not values) and the UI that displays/enforces them.
// Each is overridable per business via an env var (set in Coolify), so a
// deploy can raise/lower the limit without a code change.

function parseLimit(envValue: string | undefined, fallback: number): number {
  const parsed = Number(envValue);
  return envValue && Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const MAX_GALLERY_IMAGES = parseLimit(process.env.MAX_GALLERY_IMAGES, 8);
export const MAX_PROVIDERS = parseLimit(process.env.MAX_PROVIDERS, 5);
