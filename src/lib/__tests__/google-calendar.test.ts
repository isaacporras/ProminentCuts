import { describe, it, expect } from "vitest";
import { parseISO } from "date-fns";
import { _computeDaySlots, _filterPastSlots } from "../google-calendar";

// Costa Rica is UTC-6 with no DST, so 08:00 local = 14:00 UTC.
const TZ = "America/Costa_Rica";
const DATE = "2026-07-15";
const SCHEDULE = { start: "08:00", end: "10:00" }; // 2-hour window → 4 slots of 30 min

describe("_computeDaySlots", () => {
  describe("slot generation", () => {
    it("generates a slot every 30 minutes within the working window", () => {
      const { slots } = _computeDaySlots(DATE, SCHEDULE, [], 30, TZ);
      expect(slots).toHaveLength(4);
      expect(slots[0]).toMatchObject({ start: "08:00", end: "08:30" });
      expect(slots[1]).toMatchObject({ start: "08:30", end: "09:00" });
      expect(slots[2]).toMatchObject({ start: "09:00", end: "09:30" });
      expect(slots[3]).toMatchObject({ start: "09:30", end: "10:00" });
    });

    it("does not generate a slot whose end exceeds workEnd", () => {
      // 08:00–08:45 → only one 30-min slot fits (08:00–08:30); 08:30+30=09:00 > 08:45
      const short = { start: "08:00", end: "08:45" };
      const { slots } = _computeDaySlots(DATE, short, [], 30, TZ);
      expect(slots).toHaveLength(1);
      expect(slots[0]).toMatchObject({ start: "08:00", end: "08:30" });
    });

    it("returns empty slots for a zero-length window", () => {
      const empty = { start: "10:00", end: "10:00" };
      const { slots, total, free } = _computeDaySlots(DATE, empty, [], 30, TZ);
      expect(slots).toHaveLength(0);
      expect(total).toBe(0);
      expect(free).toBe(0);
    });
  });

  describe("cursor advancement (SLOT_STEP vs durationMinutes)", () => {
    it("advances the cursor by 30 min even when durationMinutes is 45", () => {
      // 08:00+45=08:45 ≤ 10:00 ✓ | 08:30+45=09:15 ≤ 10:00 ✓ | 09:00+45=09:45 ≤ 10:00 ✓
      // 09:30+45=10:15 > 10:00 → stop. 3 slots, overlapping.
      const { slots } = _computeDaySlots(DATE, SCHEDULE, [], 45, TZ);
      expect(slots).toHaveLength(3);
      expect(slots[0]).toMatchObject({ start: "08:00", end: "08:45" });
      expect(slots[1]).toMatchObject({ start: "08:30", end: "09:15" });
      expect(slots[2]).toMatchObject({ start: "09:00", end: "09:45" });
    });
  });

  describe("busy interval detection", () => {
    // Busy UTC: 14:30–15:00Z = 08:30–09:00 Costa Rica
    const busyMidSlot = [
      { start: parseISO("2026-07-15T14:30:00Z"), end: parseISO("2026-07-15T15:00:00Z") },
    ];

    it("marks a slot overlapping a busy interval as unavailable", () => {
      const { slots } = _computeDaySlots(DATE, SCHEDULE, busyMidSlot, 30, TZ);
      expect(slots[1]).toMatchObject({ start: "08:30", available: false });
    });

    it("leaves adjacent slots available when only one slot is busy", () => {
      const { slots } = _computeDaySlots(DATE, SCHEDULE, busyMidSlot, 30, TZ);
      expect(slots[0]).toMatchObject({ start: "08:00", available: true });
      expect(slots[2]).toMatchObject({ start: "09:00", available: true });
      expect(slots[3]).toMatchObject({ start: "09:30", available: true });
    });

    it("returns correct total and free counts", () => {
      const { total, free } = _computeDaySlots(DATE, SCHEDULE, busyMidSlot, 30, TZ);
      expect(total).toBe(4);
      expect(free).toBe(3);
    });

    it("marks all slots unavailable when the entire window is busy", () => {
      // Busy 14:00–16:00Z = 08:00–10:00 CR — covers the whole window
      const allBusy = [
        { start: parseISO("2026-07-15T14:00:00Z"), end: parseISO("2026-07-15T16:00:00Z") },
      ];
      const { free, slots } = _computeDaySlots(DATE, SCHEDULE, allBusy, 30, TZ);
      expect(free).toBe(0);
      expect(slots.every((s) => !s.available)).toBe(true);
    });
  });

  describe("timezone correctness", () => {
    it("expresses slot times in the business timezone, not UTC", () => {
      // If timezone were ignored and UTC used, a CR 08:00 slot would appear as 14:00.
      const { slots } = _computeDaySlots(DATE, SCHEDULE, [], 30, TZ);
      expect(slots[0].start).toBe("08:00");
      expect(slots[0].end).toBe("08:30");
    });

    it("correctly detects a busy slot when the event is stored in UTC", () => {
      // Event at 08:30 CR = 14:30 UTC. Slot 08:30–09:00 must be unavailable.
      const busy = [
        { start: parseISO("2026-07-15T14:30:00Z"), end: parseISO("2026-07-15T15:00:00Z") },
      ];
      const { slots } = _computeDaySlots(DATE, SCHEDULE, busy, 30, TZ);
      const slot = slots.find((s) => s.start === "08:30");
      expect(slot?.available).toBe(false);
    });
  });
});

describe("_filterPastSlots", () => {
  const TZ = "America/Costa_Rica"; // UTC-6
  const DATE = "2026-07-15";
  // Slots: 08:00, 08:30, 09:00, 09:30 (all available initially)
  const baseResult = _computeDaySlots(
    DATE,
    { start: "08:00", end: "10:00" },
    [],
    30,
    TZ
  );

  it("marks slots whose start has passed as unavailable", () => {
    // now = 08:45 CR = 14:45 UTC — slots 08:00 and 08:30 have started already
    const now = parseISO("2026-07-15T14:45:00Z");
    const { slots } = _filterPastSlots(DATE, baseResult, now, TZ);
    expect(slots[0]).toMatchObject({ start: "08:00", available: false });
    expect(slots[1]).toMatchObject({ start: "08:30", available: false });
    expect(slots[2]).toMatchObject({ start: "09:00", available: true });
    expect(slots[3]).toMatchObject({ start: "09:30", available: true });
  });

  it("updates the free count to exclude past slots", () => {
    const now = parseISO("2026-07-15T14:45:00Z"); // 08:45 CR
    const { total, free } = _filterPastSlots(DATE, baseResult, now, TZ);
    expect(total).toBe(4);
    expect(free).toBe(2);
  });

  it("marks all slots unavailable when now is after the last slot", () => {
    const now = parseISO("2026-07-15T16:30:00Z"); // 10:30 CR — after 09:30 slot
    const { free, slots } = _filterPastSlots(DATE, baseResult, now, TZ);
    expect(free).toBe(0);
    expect(slots.every((s) => !s.available)).toBe(true);
  });

  it("leaves all slots available when now is before the first slot", () => {
    const now = parseISO("2026-07-15T13:00:00Z"); // 07:00 CR — before 08:00
    const { free } = _filterPastSlots(DATE, baseResult, now, TZ);
    expect(free).toBe(4);
  });

  describe("inProgress detection", () => {
    it("marks a slot as inProgress when it has started but not yet ended", () => {
      // now = 08:15 CR = 14:15 UTC — slot 08:00–08:30 has started, not ended
      const now = parseISO("2026-07-15T14:15:00Z");
      const { slots } = _filterPastSlots(DATE, baseResult, now, TZ);
      expect(slots[0]).toMatchObject({ start: "08:00", available: false, inProgress: true });
    });

    it("does NOT set inProgress on a slot that has fully passed", () => {
      // now = 08:45 CR = 14:45 UTC — slot 08:00–08:30 has fully passed
      const now = parseISO("2026-07-15T14:45:00Z");
      const { slots } = _filterPastSlots(DATE, baseResult, now, TZ);
      expect(slots[0].inProgress).toBeFalsy();
    });

    it("does NOT set inProgress on future slots", () => {
      const now = parseISO("2026-07-15T14:15:00Z"); // 08:15 CR
      const { slots } = _filterPastSlots(DATE, baseResult, now, TZ);
      // 08:30, 09:00, 09:30 are all future
      expect(slots[1].inProgress).toBeFalsy();
      expect(slots[2].inProgress).toBeFalsy();
      expect(slots[3].inProgress).toBeFalsy();
    });
  });
});
