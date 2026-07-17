export const COUNTRY_CODES = [
  { code: "+506", label: "🇨🇷 +506" },
  { code: "+1",   label: "🇺🇸 +1" },
  { code: "+52",  label: "🇲🇽 +52" },
  { code: "+502", label: "🇬🇹 +502" },
  { code: "+503", label: "🇸🇻 +503" },
  { code: "+504", label: "🇭🇳 +504" },
  { code: "+505", label: "🇳🇮 +505" },
  { code: "+507", label: "🇵🇦 +507" },
  { code: "+57",  label: "🇨🇴 +57" },
  { code: "+58",  label: "🇻🇪 +58" },
  { code: "+51",  label: "🇵🇪 +51" },
  { code: "+56",  label: "🇨🇱 +56" },
  { code: "+54",  label: "🇦🇷 +54" },
  { code: "+55",  label: "🇧🇷 +55" },
  { code: "+34",  label: "🇪🇸 +34" },
  { code: "+44",  label: "🇬🇧 +44" },
] as const;

// Splits a stored phone value ("+506 88881234") into country code + local
// number, matching against known codes. Falls back to `defaultCode` with
// the whole value treated as the local number when nothing matches (e.g.
// empty/new field).
export function splitPhone(value: string, defaultCode: string): { code: string; number: string } {
  const match = COUNTRY_CODES.find((c) => value.startsWith(c.code));
  if (!match) return { code: defaultCode, number: value };
  return { code: match.code, number: value.slice(match.code.length).trim() };
}

export function joinPhone(code: string, number: string): string {
  return `${code} ${number}`.trim();
}
