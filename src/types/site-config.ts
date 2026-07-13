export interface NavItem {
  label: string;
  href: string;
}

export interface Terminology {
  providerSingular: string;
  providerPlural: string;
  serviceSingular: string;
  servicePlural: string;
  appointmentCta: string;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  description: string;
  /** Used as the browser tab favicon. Falls back to public/favicon.ico when unset. */
  logoUrl?: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price?: string | null;
  durationMinutes?: number | null;
}

export interface ScheduleEntry {
  day: string;
  hours: string;
}

export interface DaySchedule {
  start: string; // "10:00"
  end: string;   // "20:00"
}

export interface WorkingHoursConfig {
  monday?: DaySchedule | null;
  tuesday?: DaySchedule | null;
  wednesday?: DaySchedule | null;
  thursday?: DaySchedule | null;
  friday?: DaySchedule | null;
  saturday?: DaySchedule | null;
  sunday?: DaySchedule | null;
}

export interface AppointmentsInfo {
  intro: string;
  schedule: ScheduleEntry[];
  workingHours: WorkingHoursConfig;
  /** IANA timezone of the business (e.g. "America/Costa_Rica"). Critical for correct slot calculation when the server runs in UTC. */
  timezone: string;
  /** Default country calling code shown in the phone field (e.g. "+506"). */
  defaultPhoneCountryCode: string;
  ctaType: "whatsapp" | "phone" | "email";
  ctaValue: string;
  ctaLabel: string;
}

export interface LocationInfo {
  address: string;
  mapEmbedUrl?: string;
  schedule: ScheduleEntry[];
}

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "whatsapp"
  | "x";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface ProviderItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string | null;
  googleCalendarId?: string | null;
  /** Provider-specific schedule. Falls back to appointments.workingHours if not set. */
  workingHours?: WorkingHoursConfig | null;
  socials?: SocialLink[] | null;
}

export interface ContactInfo {
  phone: string;
  email: string;
  socials: SocialLink[];
}

// Keys map to a fixed set of next/font/google families wired up in layout.tsx.
// Adding a new option requires importing the font there too.
export type HeadingFont = "geist" | "cormorant-garamond" | "playfair-display";
export type BodyFont = "geist" | "lora" | "inter" | "montserrat" | "nunito-sans";

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  /** Defaults to "geist" if unset. */
  fontHeading?: HeadingFont;
  /** Defaults to "geist" if unset. */
  fontBody?: BodyFont;
}

/**
 * Configurable background for a section: image, flat color, or none.
 * When both are set, `color` is applied as a semi-transparent tint over `image`.
 */
export interface SectionBackground {
  image?: string;
  color?: string;
}

export interface SectionBackgrounds {
  hero?: SectionBackground;
  services?: SectionBackground;
  appointments?: SectionBackground;
  location?: SectionBackground;
  providers?: SectionBackground;
  contact?: SectionBackground;
}

export interface GalleryConfig {
  title?: string;
  subtitle?: string;
}

export interface SiteConfig {
  business: BusinessInfo;
  terminology: Terminology;
  nav: NavItem[];
  hero: HeroContent;
  // Services and providers are no longer part of the static config — they
  // live in the database and are managed from /admin.
  servicesSubtitle: string;
  appointments: AppointmentsInfo;
  location: LocationInfo;
  providersSubtitle: string;
  contact: ContactInfo;
  theme: ThemeConfig;
  sectionBackgrounds?: SectionBackgrounds;
  gallery?: GalleryConfig;
}
