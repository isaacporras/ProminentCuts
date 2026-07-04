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
  price?: string;
  durationMinutes?: number;
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
  photoUrl?: string;
  googleCalendarId?: string;
  /** Provider-specific schedule. Falls back to appointments.workingHours if not set. */
  workingHours?: WorkingHoursConfig;
  socials?: SocialLink[];
}

export interface ContactInfo {
  phone: string;
  email: string;
  socials: SocialLink[];
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
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
  services: ServiceItem[];
  servicesSubtitle: string;
  appointments: AppointmentsInfo;
  location: LocationInfo;
  providers: ProviderItem[];
  providersSubtitle: string;
  contact: ContactInfo;
  theme: ThemeConfig;
  sectionBackgrounds?: SectionBackgrounds;
  gallery?: GalleryConfig;
}
