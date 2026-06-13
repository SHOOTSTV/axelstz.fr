import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/guestbook", () => ({
  listApproved: vi.fn(async () => [
    { id: "1", name: "Ann", message: "hi", link: null, createdAt: "2026-01-01T00:00:00Z" },
  ]),
  insertPending: vi.fn(async () => {}),
}));

import { GET, POST } from "./route";
import { insertPending } from "@/lib/guestbook";

const postReq = (body: unknown) =>
  new Request("http://localhost/api/guestbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

beforeEach(() => vi.clearAllMocks());

describe("GET /api/guestbook", () => {
  it("returns approved notes", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(1);
  });
});

describe("POST /api/guestbook", () => {
  it("inserts a valid pending note", async () => {
    const res = await POST(postReq({ name: "Bo", message: "nice site" }));
    expect(res.status).toBe(201);
    expect(insertPending).toHaveBeenCalledWith({ name: "Bo", message: "nice site", link: undefined });
  });
  it("rejects empty name/message", async () => {
    const res = await POST(postReq({ name: "", message: "" }));
    expect(res.status).toBe(400);
    expect(insertPending).not.toHaveBeenCalled();
  });
  it("rejects an over-long message", async () => {
    const res = await POST(postReq({ name: "Bo", message: "x".repeat(281) }));
    expect(res.status).toBe(400);
  });
  it("rejects a non-http link", async () => {
    const res = await POST(postReq({ name: "Bo", message: "hi", link: "javascript:alert(1)" }));
    expect(res.status).toBe(400);
  });
  it("silently drops honeypot submissions without inserting", async () => {
    const res = await POST(postReq({ name: "Bo", message: "hi", hp: "i am a bot" }));
    expect(res.status).toBe(200);
    expect(insertPending).not.toHaveBeenCalled();
  });
});
