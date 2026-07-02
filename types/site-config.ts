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
  /** Zona horaria IANA del negocio (ej. "America/Costa_Rica"). Crítico para calcular slots correctamente en el servidor. */
  timezone: string;
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
  photoUrl: string;
  googleCalendarId?: string;
  /** Horario propio del barbero. Si no se define, usa appointments.workingHours. */
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
 * Fondo configurable de una sección: imagen, color plano, o ninguno.
 * Si se definen ambos, `color` se aplica como tinte semitransparente
 * sobre `image`. Debe ser legible contra el texto de esa sección.
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

export interface SiteConfig {
  business: BusinessInfo;
  terminology: Terminology;
  nav: NavItem[];
  hero: HeroContent;
  services: ServiceItem[];
  appointments: AppointmentsInfo;
  location: LocationInfo;
  providers: ProviderItem[];
  contact: ContactInfo;
  theme: ThemeConfig;
  sectionBackgrounds?: SectionBackgrounds;
}
