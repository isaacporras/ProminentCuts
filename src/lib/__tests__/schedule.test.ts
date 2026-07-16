import { describe, it, expect } from "vitest";
import { formatTimeLabel, formatWorkingHoursSchedule } from "../schedule";

describe("formatTimeLabel", () => {
  it("returns the time unchanged in 24h format", () => {
    expect(formatTimeLabel("16:30", "24h")).toBe("16:30");
    expect(formatTimeLabel("09:00", "24h")).toBe("09:00");
  });

  it("defaults to 24h when no format is given", () => {
    expect(formatTimeLabel("16:30")).toBe("16:30");
  });

  it("converts afternoon hours to 12h PM", () => {
    expect(formatTimeLabel("16:30", "12h")).toBe("4:30 PM");
    expect(formatTimeLabel("23:59", "12h")).toBe("11:59 PM");
  });

  it("converts morning hours to 12h AM", () => {
    expect(formatTimeLabel("09:00", "12h")).toBe("9:00 AM");
    expect(formatTimeLabel("00:15", "12h")).toBe("12:15 AM");
  });

  it("handles noon correctly as 12 PM", () => {
    expect(formatTimeLabel("12:00", "12h")).toBe("12:00 PM");
  });
});

describe("formatWorkingHoursSchedule with timeFormat", () => {
  const workingHours = {
    monday: { start: "16:30", end: "18:30" },
    tuesday: { start: "16:30", end: "18:30" },
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  };

  it("formats hours in 24h by default", () => {
    const [entry] = formatWorkingHoursSchedule(workingHours);
    expect(entry.hours).toBe("16:30 - 18:30");
  });

  it("formats hours in 12h when requested", () => {
    const [entry] = formatWorkingHoursSchedule(workingHours, "12h");
    expect(entry.hours).toBe("4:30 PM - 6:30 PM");
  });
});
