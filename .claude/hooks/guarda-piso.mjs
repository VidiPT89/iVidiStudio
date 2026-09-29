#!/usr/bin/env node
// PreToolUse: (1) ninguém lê .env reais; (2) um agente de piso só escreve no seu piso e no elevador.
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join, relative } from "node:path";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const tool = input.tool_name ?? "";
const args = input.tool_input ?? {};

function deny(reason) {
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason } }),
  );
  process.exit(0);
}

const ENV_FILE = /(^|[\/\s"'=])\.env(\.(?!example\b)[\w.-]+)?($|[\s"'\/;|&)])/;

// 1. Segredos
const touched = [args.file_path, args.path, args.notebook_path, args.pattern].filter(Boolean).join(" ");
if (ENV_FILE.test(touched) || (tool === "Bash" && ENV_FILE.test(args.command ?? ""))) {
  deny("Regulamento: ficheiros .env nunca são lidos nem escritos. Usa .env.example e GitHub Secrets.");
}

// 2. Fronteiras entre pisos (só dentro de um agente com piso definido)
const agent = input.agent_type;
if (!agent || !["Write", "Edit", "NotebookEdit"].includes(tool)) process.exit(0);

const agentFile = join(root, ".claude", "agents", `${agent}.md`);
if (!existsSync(agentFile)) process.exit(0);
const floor = /^Piso: `pisos\/([^/`]+)\/`/m.exec(readFileSync(agentFile, "utf8"))?.[1];
if (!floor) process.exit(0);

const target = args.file_path ?? args.notebook_path ?? "";
const rel = relative(root, isAbsolute(target) ? target : join(root, target)).split("\\").join("/");
if (rel.startsWith(`pisos/${floor}/`) || rel.startsWith("elevador/")) process.exit(0);

deny(`Regulamento: o agente ${agent} (piso ${floor}) só escreve em pisos/${floor}/ e em elevador/. Para outro piso, cria um ticket.`);
