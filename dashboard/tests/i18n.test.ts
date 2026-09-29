import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DICTS } from "@/lib/i18n";
import { FLOORS } from "@/lib/floors";

describe("translations", () => {
  it("PT and EN define the same keys", () => {
    expect(Object.keys(DICTS.en).sort()).toEqual(Object.keys(DICTS.pt).sort());
  });

  it("every key is used somewhere in the app", () => {
    const dir = join(__dirname, "..", "src", "components");
    const source = readdirSync(dir)
      .map((f) => readFileSync(join(dir, f), "utf8"))
      .join("\n");
    const unused = Object.keys(DICTS.pt).filter((k) => !source.includes(`t.${k}`));
    expect(unused).toEqual([]);
  });

  it("every floor folder in the building has dashboard metadata", () => {
    const floors = readdirSync(join(__dirname, "..", "..", "pisos"), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    expect(FLOORS.map((f) => f.slug).sort()).toEqual(floors.sort());
  });
});
