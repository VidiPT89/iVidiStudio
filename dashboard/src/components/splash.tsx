"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useMessages } from "@/lib/preferences";
import { GitHubIcon, GlobeIcon } from "./icons";

const FLOORS = 12;
const DURATION_MS = 3600;

/** Animated intro: the tower lights up floor by floor, the elevator rides to the top, then it fades away. */
export function Splash({ onDone }: { onDone: () => void }) {
  const t = useMessages();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const close = useCallback(() => {
    setVisible(false);
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(close, reduce ? 1200 : DURATION_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [visible, close, reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          role="dialog"
          aria-label="iVidi Studio HQ"
          onClick={close}
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-bg px-6"
          exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid-backdrop pointer-events-none absolute inset-0" />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, var(--glow), transparent 65%)" }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          <Tower reduce={!!reduce} />

          <motion.h1
            className="relative mt-8 text-center text-4xl font-semibold tracking-tight sm:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            iVidi Studio <span className="text-brand">HQ</span>
          </motion.h1>
          <motion.p
            className="relative mt-3 max-w-md text-center text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 1.6, duration: 0.6 }}
          >
            {t.tagline}
          </motion.p>

          <motion.div
            className="relative mt-12 flex flex-col items-center gap-2 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 1.9, duration: 0.6 }}
          >
            <p className="text-fg/80">
              Developed by <span className="font-semibold text-fg">David Arsénio Martins</span>
            </p>
            <div className="flex items-center gap-4 text-muted">
              <a
                href="https://ividi.dev/"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="focus-ring inline-flex items-center gap-1.5 rounded transition-colors hover:text-orange"
              >
                <GlobeIcon width={15} height={15} /> ividi.dev
              </a>
              <span className="h-1 w-1 rounded-full bg-line" />
              <a
                href="https://github.com/VidiPT89/"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="focus-ring inline-flex items-center gap-1.5 rounded transition-colors hover:text-orange"
              >
                <GitHubIcon width={15} height={15} /> github.com/VidiPT89
              </a>
            </div>
          </motion.div>

          <button
            type="button"
            onClick={close}
            className="focus-ring absolute right-5 top-5 rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-orange hover:text-orange"
          >
            {t.skip}
          </button>

          <motion.div
            className="bg-brand absolute bottom-0 left-0 h-0.5"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: (reduce ? 1200 : DURATION_MS) / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Tower({ reduce }: { reduce: boolean }) {
  const floorH = 11;
  const top = 18;
  const height = top + FLOORS * floorH;
  const step = reduce ? 0 : 0.07;

  return (
    <svg width="168" height={(height + 14) * 1.4} viewBox={`0 0 120 ${height + 14}`} className="relative" aria-hidden>
      <defs>
        <linearGradient id="tower-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--gold)" />
          <stop offset="1" stopColor="var(--orange)" />
        </linearGradient>
      </defs>

      {/* antenna */}
      <motion.line
        x1="60" y1="2" x2="60" y2={top}
        stroke="var(--gold)" strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: FLOORS * step, duration: 0.3 }}
      />
      <circle cx="60" cy="3" r="2.5" fill="var(--orange)" className="animate-blink" />

      {Array.from({ length: FLOORS }, (_, i) => {
        const y = top + (FLOORS - 1 - i) * floorH;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * step, duration: 0.35, ease: "easeOut" }}
          >
            <rect x="22" y={y} width="76" height={floorH - 2} rx="2" fill="var(--surface-2)" stroke="var(--line)" />
            {[28, 38, 70, 80].map((x, w) => (
              <motion.rect
                key={x}
                x={x} y={y + 3} width="7" height={floorH - 8} rx="1"
                fill="url(#tower-g)"
                initial={{ opacity: 0.08 }}
                animate={{ opacity: (i + w) % 3 === 0 ? 0.35 : 0.95 }}
                transition={{ delay: i * step + 0.25, duration: 0.3 }}
              />
            ))}
          </motion.g>
        );
      })}

      {/* elevator shaft and car */}
      <rect x="54" y={top} width="12" height={FLOORS * floorH - 2} rx="2" fill="var(--bg)" stroke="var(--line)" />
      <motion.rect
        x="56" width="8" height={floorH - 4} rx="1.5"
        fill="var(--orange)"
        initial={{ y: top + (FLOORS - 1) * floorH + 1 }}
        animate={{ y: top + 1 }}
        transition={{ delay: reduce ? 0 : 0.5, duration: reduce ? 0 : 1.6, ease: [0.65, 0, 0.35, 1] }}
      />

      {/* ground */}
      <rect x="8" y={height + 4} width="104" height="2" rx="1" fill="url(#tower-g)" opacity="0.8" />
    </svg>
  );
}
