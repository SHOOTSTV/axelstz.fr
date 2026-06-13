import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/guestbook", () => ({
  approve: vi.fn(async () => {}),
  remove: vi.fn(async () => {}),
}));

import { POST } from "./route";
import { approve, remove } from "@/lib/guestbook";

const formReq = (fields: Record<string, string>, headers: Record<string, string> = { origin: "http://localhost" }) =>
  new Request("http://localhost/api/guestbook/admin", {
    method: "POST",
    headers,
    body: new URLSearchParams(fields),
  });

beforeEach(() => vi.clearAllMocks());

describe("POST /api/guestbook/admin", () => {
  it("approves a note", async () => {
    const res = await POST(formReq({ id: "1", action: "approve" }));
    expect(approve).toHaveBeenCalledWith("1");
    expect(res.status).toBe(303);
  });
  it("deletes a note", async () => {
    await POST(formReq({ id: "2", action: "delete" }));
    expect(remove).toHaveBeenCalledWith("2");
  });
  it("rejects a missing id", async () => {
    const res = await POST(formReq({ action: "approve" }));
    expect(res.status).toBe(400);
    expect(approve).not.toHaveBeenCalled();
  });
  it("rejects an unknown action", async () => {
    const res = await POST(formReq({ id: "1", action: "nuke" }));
    expect(res.status).toBe(400);
  });
  it("rejects a cross-origin request (CSRF)", async () => {
    const res = await POST(formReq({ id: "1", action: "approve" }, { origin: "http://evil.example" }));
    expect(res.status).toBe(403);
    expect(approve).not.toHaveBeenCalled();
  });
  it("rejects a request with no Origin or Referer", async () => {
    const res = await POST(formReq({ id: "1", action: "approve" }, {}));
    expect(res.status).toBe(403);
    expect(approve).not.toHaveBeenCalled();
  });
});
