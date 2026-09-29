"use client";

import { useEffect } from "react";
import { applyTheme, useMessages, useTheme } from "@/lib/preferences";
import { BuildingMark } from "./icons";
import { Settings } from "./settings";

export function Header() {
  const t = useMessages();
  const [theme] = useTheme();

  // Keep the page in sync when the OS theme changes while "system" is selected.
  useEffect(() => {
    applyTheme(theme);
  });

  const nav = [
    ["#edificio", t.navBuilding],
    ["#aprovacoes", t.navApprovals],
    ["#elevador", t.navElevator],
    ["#atividade", t.navActivity],
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <a href="#" className="focus-ring flex items-center gap-2.5 rounded-lg">
          <BuildingMark size={30} />
          <span className="text-[15px] font-semibold tracking-tight">
            iVidi Studio <span className="text-brand">HQ</span>
          </span>
        </a>

        <nav className="ml-6 hidden items-center gap-1 text-sm text-muted lg:flex">
          {nav.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="focus-ring rounded-full px-3 py-1.5 transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto">
          <Settings />
        </div>
      </div>
    </header>
  );
}
