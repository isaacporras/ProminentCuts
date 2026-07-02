import type { SiteConfig } from "@/types/site-config";

/**
 * Single file to edit when reusing this site for a different business.
 * Components never hardcode business-specific text — everything comes from here.
 * Images → public/brand/ | Environment variables → .env.local (see .env.example)
 */
export const siteConfig: SiteConfig = {
  business: {
    name: "Prominent Cuts",
    tagline: "Club de Caballeros",
    description:
      "Una barbería urbana con técnica clásica, atención cercana y detalle en cada corte. Trabajamos cortes tradicionales, degradados, barba y acabados pensados para que salgas fresco y con estilo propio.",
  },

  terminology: {
    providerSingular: "Barbero",
    providerPlural: "Barberos",
    serviceSingular: "Servicio",
    servicePlural: "Servicios",
    appointmentCta: "Reservar por WhatsApp",
  },

  nav: [
    { label: "Acerca", href: "#acerca" },
    { label: "Servicios", href: "#servicios" },
    { label: "Citas", href: "#citas" },
    { label: "Barberos", href: "#barberos" },
    { label: "Ubicación", href: "#ubicacion" },
    { label: "Contacto", href: "#contacto" },
  ],

  hero: {
    headline: "Tu mejor versión empieza con un buen corte",
    subheadline:
      "Cortes clásicos, afeitado tradicional y diseño de barba en un ambiente cómodo y cercano.",
    ctaLabel: "Reservar una cita",
    ctaHref: "#citas",
  },

  services: [
    {
      id: "corte-clasico",
      name: "Corte clásico",
      description: "Corte tradicional",
      price: "₡5000",
      durationMinutes: 30,
    },
    {
      id: "corte-barba",
      name: "Corte + Barba",
      description: "Combo de corte clásico con perfilado de barba.",
      price: "₡6000",
      durationMinutes: 45,
    },
    {
      id: "perfilado-cejas",
      name: "Perfilado de Cejas",
      description: "Perfilado y limpieza de cejas.",
      price: "₡6.000",
      durationMinutes: 20,
    },
  ],

  appointments: {
    intro:
      "Agendá tu cita directamente desde aquí. Elegí tu barbero, servicio y horario disponible.",
    schedule: [
      { day: "Lunes a Viernes", hours: "10:00 - 20:00" },
      { day: "Sábado", hours: "10:00 - 18:00" },
      { day: "Domingo", hours: "Cerrado" },
    ],
    // Machine-readable hours for slot calculation.
    // null = closed. Must match the human-readable `schedule` above.
    workingHours: {
      monday:    { start: "10:00", end: "20:00" },
      tuesday:   { start: "10:00", end: "20:00" },
      wednesday: { start: "10:00", end: "20:00" },
      thursday:  { start: "10:00", end: "20:00" },
      friday:    { start: "10:00", end: "20:00" },
      saturday:  { start: "10:00", end: "18:00" },
      sunday:    null,
    },
    // IANA timezone — critical so slots match local time even when the server runs in UTC.
    timezone: "America/Costa_Rica",
    ctaType: "whatsapp",
    ctaValue: "+506 87931306",
    ctaLabel: "Reservar por WhatsApp",
  },

  location: {
    address: "Av. Siempre Viva 1234, Local 2, Santiago",
    schedule: [
      { day: "Lunes a Viernes", hours: "10:00 - 20:00" },
      { day: "Sábado", hours: "10:00 - 18:00" },
      { day: "Domingo", hours: "Cerrado" },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d292.06060513195865!2d-84.00988543011185!3d9.976864210303397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2scr!4v1782943997060!5m2!1ses!2scr",
  },

  providers: [
    {
      id: "kevin-figueroa",
      name: "Kevin Figueroa",
      role: "Barbero senior",
      bio: "Más de 12 años de experiencia en cortes clásicos y urbanos.",
      photoUrl: "/brand/providers/kevin-figueroa.webp",
      googleCalendarId: "imanoisaac@gmail.com",
      workingHours: {
        monday:    null,
        tuesday:   { start: "08:00", end: "20:00" },
        wednesday: { start: "08:00", end: "20:00" },
        thursday:  { start: "08:00", end: "20:00" },
        friday:    { start: "08:00", end: "20:00" },
        saturday:  { start: "08:00", end: "20:00" },
        sunday:    null,
      },
      socials: [
        { platform: "instagram", url: "https://instagram.com" },
      ],
    },
    {
      id: "leonardo-carcache",
      name: "Leonardo Carcache",
      role: "Barbero senior",
      bio: "Más de 10 años de experiencia en cortes modernos y diseño de barba.",
      photoUrl: "/brand/providers/leonardo-carcache.webp",
      googleCalendarId: "leonardo@gmail.com",
      // Custom schedule: works Tuesday–Saturday
      workingHours: {
        monday:    null,
        tuesday:   { start: "10:00", end: "20:00" },
        wednesday: { start: "10:00", end: "20:00" },
        thursday:  { start: "10:00", end: "20:00" },
        friday:    { start: "10:00", end: "20:00" },
        saturday:  { start: "10:00", end: "20:00" },
        sunday:    null,
      },
      socials: [
        { platform: "instagram", url: "https://instagram.com" },
        { platform: "tiktok", url: "https://tiktok.com" },
      ],
    },
    {
      id: "barbero-3",
      name: "Barbero 3",
      role: "Barbero senior",
      bio: "Más de 10 años de experiencia en cortes modernos y diseño de barba.",
      photoUrl: "/brand/providers/barbero-3.webp",
      // No googleCalendarId → not bookable online
      socials: [
        { platform: "instagram", url: "https://instagram.com" },
        { platform: "facebook", url: "https://facebook.com" },
      ],
    },
  ],

  contact: {
    phone: "+506 87931306",
    email: "contacto@barberiaelroble.cl",
    socials: [
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "facebook", url: "https://facebook.com" },
      { platform: "whatsapp", url: "https://wa.me/50687931306" },
    ],
  },

  theme: {
    primary: "#1a1a1a",
    secondary: "#c9a227",
    accent: "#c9a227",
    background: "#fafaf9",
    text: "#1a1a1a",
  },

  sectionBackgrounds: {
    hero: { image: "/brand/backgrounds/hero.webp" },
    appointments: { color: "#f3e9d8" },
  },
};

export default siteConfig;
