"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LANGS, type Lang } from "@/lib/i18n";
import { THEMES, useLang, useMessages, useTheme, type ThemeChoice } from "@/lib/preferences";
import { CloseIcon, GearIcon, MonitorIcon, MoonIcon, SunIcon } from "./icons";

const THEME_ICONS: Record<ThemeChoice, ReactNode> = {
  system: <MonitorIcon width={16} height={16} />,
  light: <SunIcon width={16} height={16} />,
  dark: <MoonIcon width={16} height={16} />,
};

const LANG_NAMES: Record<Lang, string> = { pt: "Português", en: "English" };

/** Gear button in the header that opens the Settings panel (language and appearance). */
export function Settings() {
  const t = useMessages();
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!panel.current?.contains(target) && !button.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const themeLabel = { system: t.themeSystem, light: t.themeLight, dark: t.themeDark };

  return (
    <div className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.settings}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={t.settings}
        className={`focus-ring flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
          open ? "border-orange text-orange" : "border-line bg-surface text-muted hover:border-orange hover:text-orange"
        }`}
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <GearIcon />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            role="dialog"
            aria-label={t.settings}
            tabIndex={-1}
            className="card absolute right-0 top-12 z-50 w-[min(20rem,calc(100vw-2rem))] p-5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)] outline-none"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top right" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">{t.settings}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="focus-ring rounded-full p-1 text-muted transition-colors hover:text-orange"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </div>

            <Group label={t.language}>
              {LANGS.map((l) => (
                <Option key={l} group="lang" active={lang === l} onClick={() => setLang(l)}>
                  <span className="font-mono text-[11px] font-semibold">{l.toUpperCase()}</span>
                  <span>{LANG_NAMES[l]}</span>
                </Option>
              ))}
            </Group>

            <Group label={t.theme}>
              {THEMES.map((th) => (
                <Option key={th} group="theme" active={theme === th} onClick={() => setTheme(th)}>
                  {THEME_ICONS[th]}
                  <span>{themeLabel[th]}</span>
                </Option>
              ))}
            </Group>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
      <div role="group" aria-label={label} className="flex rounded-xl border border-line bg-bg p-1">
        {children}
      </div>
    </div>
  );
}

function Option({
  group,
  active,
  onClick,
  children,
}: {
  group: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`focus-ring relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#0a0a0f]" : "text-muted hover:text-fg"
      }`}
    >
      {active && (
        <motion.span
          layoutId={`settings-${group}`}
          className="bg-brand absolute inset-0 rounded-lg"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <span className="relative flex items-center gap-1.5">{children}</span>
    </button>
  );
}
