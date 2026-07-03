import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepSelectDate } from "../StepSelectDate";
import type { ProviderItem, ServiceItem } from "@/types/site-config";

const provider: ProviderItem = {
  id: "p1",
  name: "Test Barber",
  role: "Barber",
  bio: "Bio",
  photoUrl: "/test.webp",
  googleCalendarId: "test@gmail.com",
};

const service: ServiceItem = {
  id: "s1",
  name: "Test Service",
  description: "Desc",
  durationMinutes: 30,
};

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockFetch.mockReset();
});

describe("StepSelectDate — month navigation", () => {
  it("disables the back button when showing the current month", async () => {
    render(
      <StepSelectDate provider={provider} service={service} selected={null} onSelect={vi.fn()} />
    );
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(screen.getByRole("button", { name: /previous month/i })).toBeDisabled();
  });

  it("enables the back button after navigating one month forward", async () => {
    const user = userEvent.setup();
    render(
      <StepSelectDate provider={provider} service={service} selected={null} onSelect={vi.fn()} />
    );
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    await user.click(screen.getByRole("button", { name: /next month/i }));
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    expect(screen.getByRole("button", { name: /previous month/i })).not.toBeDisabled();
  });

  it("disables the back button again after returning to the current month", async () => {
    const user = userEvent.setup();
    render(
      <StepSelectDate provider={provider} service={service} selected={null} onSelect={vi.fn()} />
    );
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    await user.click(screen.getByRole("button", { name: /next month/i }));
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    await user.click(screen.getByRole("button", { name: /previous month/i }));
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(3));
    expect(screen.getByRole("button", { name: /previous month/i })).toBeDisabled();
  });

  it("shows a WhatsApp fallback when the API returns an error", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: "not found" }) });
    render(
      <StepSelectDate provider={provider} service={service} selected={null} onSelect={vi.fn()} />
    );
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /whatsapp/i })).toBeInTheDocument()
    );
  });
});
