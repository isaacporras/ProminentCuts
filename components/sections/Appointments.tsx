import { siteConfig } from "@/config/site.config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { BookingModal } from "@/components/booking/BookingModal";

export function Appointments() {
  const { appointments } = siteConfig;

  return (
    <section id="citas" className="relative isolate overflow-hidden bg-primary/5 py-20">
      <SectionBackdrop
        background={siteConfig.sectionBackgrounds?.appointments}
        defaultOverlayColor={siteConfig.theme.background}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <SectionHeading title="Citas" subtitle={appointments.intro} />
        <div className="mx-auto max-w-sm divide-y divide-primary/10 rounded-xl border border-primary/10 bg-bg text-left">
          {appointments.schedule.map((entry) => (
            <div key={entry.day} className="flex justify-between px-6 py-3 text-sm">
              <span className="font-medium text-primary">{entry.day}</span>
              <span className="text-text/70">{entry.hours}</span>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <BookingModal />
        </div>
      </div>
    </section>
  );
}
