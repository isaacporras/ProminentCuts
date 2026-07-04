interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-primary sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-text/70">{subtitle}</p>
      )}
      <div className="mx-auto mt-4 h-1 w-16 rounded bg-secondary" />
    </div>
  );
}
