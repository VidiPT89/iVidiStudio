"use client";

import { motion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { LANGS } from "@/lib/i18n";
import { THEMES, applyTheme, useLang, useMessages, useTheme, type ThemeChoice } from "@/lib/preferences";
import { BuildingMark, MonitorIcon, MoonIcon, SunIcon } from "./icons";

const THEME_ICONS: Record<ThemeChoice, ReactNode> = {
  system: <MonitorIcon width={15} height={15} />,
  light: <SunIcon width={15} height={15} />,
  dark: <MoonIcon width={15} height={15} />,
};

export function Header() {
  const t = useMessages();
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();

  // Keep the page in sync when the OS theme changes while "system" is selected.
  useEffect(() => {
    applyTheme(theme);
  });

  const themeLabel = { system: t.themeSystem, light: t.themeLight, dark: t.themeDark };
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

        <div className="ml-auto flex items-center gap-2">
          <Segmented label={t.language}>
            {LANGS.map((l) => (
              <SegmentButton key={l} group="lang" active={lang === l} onClick={() => setLang(l)} title={l.toUpperCase()}>
                <span className="text-xs font-semibold">{l.toUpperCase()}</span>
              </SegmentButton>
            ))}
          </Segmented>
          <Segmented label={t.theme}>
            {THEMES.map((th) => (
              <SegmentButton
                key={th}
                group="theme"
                active={theme === th}
                onClick={() => setTheme(th)}
                title={themeLabel[th]}
              >
                {THEME_ICONS[th]}
              </SegmentButton>
            ))}
          </Segmented>
        </div>
      </div>
    </header>
  );
}

function Segmented({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex items-center rounded-full border border-line bg-surface p-0.5">
      {children}
    </div>
  );
}

function SegmentButton({
  group,
  active,
  onClick,
  title,
  children,
}: {
  group: string;
  active: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`focus-ring relative flex h-7 min-w-8 items-center justify-center rounded-full px-2 transition-colors ${
        active ? "text-[#0a0a0f]" : "text-muted hover:text-fg"
      }`}
    >
      {active && (
        <motion.span
          layoutId={`seg-${group}`}
          className="bg-brand absolute inset-0 rounded-full"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
