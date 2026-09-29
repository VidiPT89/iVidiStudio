import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// The PreToolUse hook that enforces the building rules (.claude/hooks/guarda-piso.mjs).
const root = join(__dirname, "..", "..");
const hook = join(root, ".claude", "hooks", "guarda-piso.mjs");

function decide(input: object): "deny" | "allow" {
  const out = execFileSync("node", [hook], {
    input: JSON.stringify(input),
    env: { ...process.env, CLAUDE_PROJECT_DIR: root },
  }).toString();
  return out.includes('"permissionDecision":"deny"') ? "deny" : "allow";
}

const write = (agent: string | undefined, file_path: string) =>
  decide({ agent_type: agent, tool_name: "Write", tool_input: { file_path } });

describe("floor boundaries", () => {
  it("lets a floor agent write on its floor and in the elevator", () => {
    expect(write("chefe-vendas", "pisos/01-vendas/registos/x.md")).toBe("allow");
    expect(write("chefe-vendas", join(root, "elevador/em-curso/T-x.md"))).toBe("allow");
    expect(write("chefe-infraestrutura", "pisos/-1-infraestrutura/registos/x.md")).toBe("allow");
  });

  it("blocks writing on another floor, including through ../", () => {
    expect(write("chefe-vendas", "pisos/07-financas/x.md")).toBe("deny");
    expect(write("chefe-vendas", "pisos/01-vendas/../07-financas/x.md")).toBe("deny");
    expect(write("porteiro", "CLAUDE.md")).toBe("deny");
  });

  it("does not restrict the main session or agents without a floor", () => {
    expect(write(undefined, "CLAUDE.md")).toBe("allow");
    expect(write("Explore", "README.md")).toBe("allow");
  });
});

describe("secrets", () => {
  const dotenv = "." + "env";

  it("blocks env files for everyone but allows the example file", () => {
    expect(decide({ tool_name: "Read", tool_input: { file_path: `dashboard/${dotenv}.local` } })).toBe("deny");
    expect(decide({ tool_name: "Bash", tool_input: { command: `cat ${dotenv}` } })).toBe("deny");
    expect(decide({ tool_name: "Read", tool_input: { file_path: `dashboard/${dotenv}.example` } })).toBe("allow");
    expect(decide({ tool_name: "Bash", tool_input: { command: "ls environment/" } })).toBe("allow");
  });
});
