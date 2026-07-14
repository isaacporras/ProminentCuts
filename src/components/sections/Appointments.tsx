import { eq } from "drizzle-orm";
import { siteConfig } from "@/config/site.config";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { formatWorkingHoursSchedule } from "@/lib/schedule";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { BookingModal } from "@/components/booking/BookingModal";

export function Appointments() {
  const { appointments } = siteConfig;
  const row = db.select().from(settings).where(eq(settings.id, "main")).get();
  const workingHours = row?.workingHours ?? appointments.workingHours;
  const schedule = formatWorkingHoursSchedule(workingHours);

  return (
    <section id="citas" className="relative overflow-hidden bg-primary/5 py-20">
      <SectionBackdrop
        background={siteConfig.sectionBackgrounds?.appointments}
        defaultOverlayColor={siteConfig.theme.background}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <SectionHeading title="Citas" subtitle={appointments.intro} />
        <div className="mx-auto max-w-sm divide-y divide-primary/10 rounded-xl border border-primary/10 bg-bg text-left">
          {schedule.map((entry) => (
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
