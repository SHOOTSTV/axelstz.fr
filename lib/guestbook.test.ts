import { describe, it, expect, vi, beforeEach } from "vitest";

const sql = vi.fn();
vi.mock("@neondatabase/serverless", () => ({ neon: vi.fn(() => sql) }));

import { listApproved, insertPending, approve, remove } from "./guestbook";

beforeEach(() => {
  sql.mockReset();
  process.env.DATABASE_URL = "postgres://test";
});

describe("lib/guestbook", () => {
  it("listApproved maps rows to Note shape", async () => {
    sql.mockResolvedValueOnce([
      { id: "1", name: "Ann", message: "hi", link: null, created_at: "2026-01-01T00:00:00Z" },
    ]);
    const notes = await listApproved();
    expect(notes).toEqual([
      { id: "1", name: "Ann", message: "hi", link: null, createdAt: "2026-01-01T00:00:00Z" },
    ]);
  });

  it("insertPending runs a query", async () => {
    sql.mockResolvedValueOnce([]);
    await insertPending({ name: "Ann", message: "hi" });
    expect(sql).toHaveBeenCalledTimes(1);
  });

  it("approve and remove run a query", async () => {
    sql.mockResolvedValue([]);
    await approve("1");
    await remove("2");
    expect(sql).toHaveBeenCalledTimes(2);
  });

  it("throws when DATABASE_URL is missing", async () => {
    delete process.env.DATABASE_URL;
    await expect(listApproved()).rejects.toThrow(/DATABASE_URL/);
  });
});
