import { cn } from "@/lib/utils";

interface CTAButtonProps {
  href: string;
  label: string;
  variant?: "solid" | "outline";
  className?: string;
}

export function CTAButton({ href, label, variant = "solid", className }: CTAButtonProps) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition",
        variant === "solid"
          ? "bg-secondary text-primary hover:opacity-90"
          : "border border-secondary text-secondary hover:bg-secondary hover:text-primary",
        className
      )}
    >
      {label}
    </a>
  );
}
