"use client";

import { useSyncExternalStore } from "react";
import { DICTS, LANGS, type Lang, type Messages } from "./i18n";
import { LANG_KEY, THEME_KEY } from "./storage-keys";

export type ThemeChoice = "system" | "light" | "dark";
export const THEMES: ThemeChoice[] = ["system", "light", "dark"];

// Storage can throw (private mode, blocked site data); preferences are a convenience.
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", fn);
  return () => {
    listeners.delete(fn);
    media.removeEventListener("change", fn);
  };
};
const emit = () => listeners.forEach((fn) => fn());

function currentLang(): Lang {
  const saved = read(LANG_KEY);
  if (saved && (LANGS as string[]).includes(saved)) return saved as Lang;
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function currentTheme(): ThemeChoice {
  const saved = read(THEME_KEY);
  return saved && (THEMES as string[]).includes(saved) ? (saved as ThemeChoice) : "system";
}

function resolveTheme(choice: ThemeChoice): "light" | "dark" {
  if (choice !== "system") return choice;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(choice: ThemeChoice) {
  const resolved = resolveTheme(choice);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export function useLang(): [Lang, (lang: Lang) => void] {
  const lang = useSyncExternalStore(subscribe, currentLang, () => "pt" as Lang);
  return [
    lang,
    (next) => {
      write(LANG_KEY, next);
      document.documentElement.lang = next === "pt" ? "pt-PT" : "en";
      emit();
    },
  ];
}

export function useMessages(): Messages {
  return DICTS[useLang()[0]];
}

export function useTheme(): [ThemeChoice, (theme: ThemeChoice) => void] {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "system" as ThemeChoice);
  return [
    theme,
    (next) => {
      write(THEME_KEY, next);
      applyTheme(next);
      emit();
    },
  ];
}
