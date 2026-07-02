"use client";

import { cn } from "@/lib/utils";
import type { BookingFormData } from "@/types/booking";

interface StepContactFormProps {
  data: BookingFormData;
  onChange: (data: BookingFormData) => void;
}

interface FieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  as?: "textarea";
}

function Field({ label, type = "text", value, onChange, required, placeholder, as }: FieldProps) {
  const base =
    "w-full rounded-lg border border-primary/20 bg-bg px-3 py-2 text-sm text-primary placeholder:text-text/30 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-text/70">
        {label} {required && <span className="text-secondary">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(base, "resize-none")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

export function StepContactForm({ data, onChange }: StepContactFormProps) {
  const set = (key: keyof BookingFormData) => (v: string) =>
    onChange({ ...data, [key]: v });

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-primary">Tus datos</h2>
      <p className="mb-6 text-sm text-text/60">Para confirmar y enviarte el detalle por correo.</p>
      <div className="flex flex-col gap-4">
        <Field label="Nombre" value={data.name} onChange={set("name")} required placeholder="Tu nombre completo" />
        <Field label="Correo electrónico" type="email" value={data.email} onChange={set("email")} required placeholder="tu@correo.com" />
        <Field label="Teléfono" type="tel" value={data.phone} onChange={set("phone")} required placeholder="+506 8888 8888" />
        <Field label="Comentarios" value={data.comments} onChange={set("comments")} placeholder="Algo que quieras comentarnos (opcional)" as="textarea" />
      </div>
    </div>
  );
}
