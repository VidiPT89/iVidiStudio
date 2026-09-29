import { describe, expect, it } from "vitest";
import { checkBasicAuth } from "@/lib/auth";

const basic = (s: string) => `Basic ${btoa(s)}`;

describe("checkBasicAuth", () => {
  it("accepts the right user and password", () => {
    expect(checkBasicAuth(basic("vidi:c0rreta:com:dois-pontos"), "vidi", "c0rreta:com:dois-pontos")).toBe("ok");
  });

  it("rejects wrong credentials and malformed headers", () => {
    expect(checkBasicAuth(basic("vidi:errada"), "vidi", "certa")).toBe("denied");
    expect(checkBasicAuth(basic("outro:certa"), "vidi", "certa")).toBe("denied");
    expect(checkBasicAuth(basic("vidi:cert"), "vidi", "certa")).toBe("denied");
    expect(checkBasicAuth(null, "vidi", "certa")).toBe("denied");
    expect(checkBasicAuth("Bearer x", "vidi", "certa")).toBe("denied");
    expect(checkBasicAuth("Basic %%%", "vidi", "certa")).toBe("denied");
    expect(checkBasicAuth(basic("semdoispontos"), "vidi", "certa")).toBe("denied");
  });

  it("reports when no login is configured", () => {
    expect(checkBasicAuth(basic("vidi:x"), undefined, undefined)).toBe("not-configured");
  });
});
