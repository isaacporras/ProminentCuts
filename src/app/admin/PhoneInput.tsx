"use client";

import { useState } from "react";
import { COUNTRY_CODES, splitPhone, joinPhone } from "@/lib/phone";
import { inputBase } from "./ui";

// Same visual treatment as inputBase, but without `w-full` — mixing that
// with `w-auto` on the same element is a no-op fight (equal specificity,
// order in the generated stylesheet decides the winner, not className
// order), which is what made this select render huge/tiny at random.
const selectBase =
  "shrink-0 rounded-md border border-primary/15 bg-bg px-2.5 py-2.5 text-sm text-primary transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

interface PhoneInputProps {
  name: string;
  defaultValue?: string | null;
  defaultCountryCode: string;
  placeholder?: string;
}

export function PhoneInput({ name, defaultValue, defaultCountryCode, placeholder = "8888 8888" }: PhoneInputProps) {
  const initial = splitPhone(defaultValue ?? "", defaultCountryCode);
  const [countryCode, setCountryCode] = useState(initial.code);
  const [localNumber, setLocalNumber] = useState(initial.number);

  const combined = localNumber ? joinPhone(countryCode, localNumber) : "";

  return (
    <div className="flex gap-2">
      <input type="hidden" name={name} value={combined} />
      <select
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        aria-label="Código de país"
        className={selectBase}
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code} value={c.code}>{c.label}</option>
        ))}
      </select>
      <input
        type="tel"
        value={localNumber}
        onChange={(e) => setLocalNumber(e.target.value)}
        placeholder={placeholder}
        className={`${inputBase} flex-1`}
      />
    </div>
  );
}
