"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site.config";
import { COUNTRY_CODES } from "@/lib/phone";
import type { BookingFormData } from "@/types/booking";

interface StepContactFormProps {
  data: BookingFormData;
  onChange: (data: BookingFormData) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputBase =
  "w-full rounded-lg border border-primary/20 bg-bg px-3 py-2 text-sm text-primary placeholder:text-text/30 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary";

export function StepContactForm({ data, onChange }: StepContactFormProps) {
  const defaultCode = siteConfig.appointments.defaultPhoneCountryCode;

  // Split the stored phone value ("+506 88881234") into code + local number.
  const [countryCode, setCountryCode] = useState<string>(() => {
    const match = COUNTRY_CODES.find((c) => data.phone.startsWith(c.code));
    return match?.code ?? defaultCode;
  });
  const [localNumber, setLocalNumber] = useState<string>(() => {
    const match = COUNTRY_CODES.find((c) => data.phone.startsWith(c.code));
    return match ? data.phone.slice(match.code.length).trim() : data.phone;
  });

  const [emailTouched, setEmailTouched] = useState(false);
  const emailError = emailTouched && data.email && !EMAIL_RE.test(data.email);

  function set(key: keyof BookingFormData) {
    return (v: string) => onChange({ ...data, [key]: v });
  }

  function handleCountryChange(code: string) {
    setCountryCode(code);
    onChange({ ...data, phone: `${code} ${localNumber}`.trim() });
  }

  function handleLocalNumberChange(num: string) {
    setLocalNumber(num);
    onChange({ ...data, phone: `${countryCode} ${num}`.trim() });
  }

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-primary">Tus datos</h2>
      <p className="mb-6 text-sm text-text/60">Para confirmar y enviarte el detalle por correo.</p>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text/70">
            Nombre <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => set("name")(e.target.value)}
            placeholder="Tu nombre completo"
            className={inputBase}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text/70">
            Correo electrónico <span className="text-secondary">*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => set("email")(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="tu@correo.com"
            className={cn(inputBase, emailError && "border-red-400 focus:border-red-400 focus:ring-red-400")}
          />
          {emailError && (
            <p className="text-xs text-red-500">Ingresá un correo electrónico válido.</p>
          )}
        </div>

        {/* Phone with country code */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text/70">
            Teléfono <span className="text-secondary">*</span>
          </label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="rounded-lg border border-primary/20 bg-bg px-2 py-2 text-sm text-primary focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              type="tel"
              value={localNumber}
              onChange={(e) => handleLocalNumberChange(e.target.value)}
              placeholder="8888 8888"
              className={cn(inputBase, "flex-1")}
            />
          </div>
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text/70">Comentarios</label>
          <textarea
            rows={3}
            value={data.comments}
            onChange={(e) => set("comments")(e.target.value)}
            placeholder="Algo que quieras comentarnos (opcional)"
            className={cn(inputBase, "resize-none")}
          />
        </div>
      </div>
    </div>
  );
}
