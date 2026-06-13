import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Guestbook } from "@/components/steam/Guestbook";

function mockFetch(getNotes: unknown[]) {
  return vi.fn(async (url: string | URL, init?: RequestInit) => {
    if (init?.method === "POST") return new Response(JSON.stringify({ ok: true }), { status: 201 });
    return new Response(JSON.stringify(getNotes), { status: 200 });
  });
}

beforeEach(() => vi.restoreAllMocks());

describe("Guestbook", () => {
  it("renders approved notes from the API", async () => {
    vi.stubGlobal("fetch", mockFetch([
      { id: "1", name: "Ann", message: "love it", link: null, createdAt: "2026-01-01T00:00:00Z" },
    ]));
    render(<Guestbook />);
    expect(await screen.findByText("love it")).toBeTruthy();
    expect(screen.getByText("Ann")).toBeTruthy();
  });

  it("shows an empty state when there are no notes", async () => {
    vi.stubGlobal("fetch", mockFetch([]));
    render(<Guestbook />);
    expect(await screen.findByText(/be the first to sign/i)).toBeTruthy();
  });

  it("confirms after posting and does not add the note to the list", async () => {
    vi.stubGlobal("fetch", mockFetch([]));
    render(<Guestbook />);
    await screen.findByText(/be the first to sign/i);
    await userEvent.type(screen.getByPlaceholderText(/your name/i), "Bo");
    await userEvent.type(screen.getByPlaceholderText(/leave a note/i), "great work");
    await userEvent.click(screen.getByRole("button", { name: /sign/i }));
    await waitFor(() => expect(screen.getByText(/awaiting approval/i)).toBeTruthy());
    expect(screen.queryByText("great work")).toBeNull();
  });

  it("renders a hidden honeypot field", () => {
    vi.stubGlobal("fetch", mockFetch([]));
    const { container } = render(<Guestbook />);
    expect(container.querySelector('input[name="hp"]')).toBeTruthy();
  });
});
