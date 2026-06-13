import { describe, it, expect } from "vitest";
import { checkBasicAuth } from "./auth";

const header = (u: string, p: string) => "Basic " + btoa(`${u}:${p}`);

describe("checkBasicAuth", () => {
  it("accepts matching credentials", () => {
    expect(checkBasicAuth(header("admin", "secret"), "admin", "secret")).toBe(true);
  });
  it("rejects wrong password", () => {
    expect(checkBasicAuth(header("admin", "nope"), "admin", "secret")).toBe(false);
  });
  it("rejects wrong username", () => {
    expect(checkBasicAuth(header("root", "secret"), "admin", "secret")).toBe(false);
  });
  it("rejects missing or malformed header", () => {
    expect(checkBasicAuth(null, "admin", "secret")).toBe(false);
    expect(checkBasicAuth("Bearer xyz", "admin", "secret")).toBe(false);
    expect(checkBasicAuth("Basic !!!notbase64", "admin", "secret")).toBe(false);
  });
  it("rejects when configured creds are blank", () => {
    expect(checkBasicAuth(header("", ""), "", "")).toBe(false);
  });
});
