"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang, useMessages } from "@/lib/preferences";
import { useIntroDone } from "./intro";
import { useLive } from "./live";

export function Hero() {
  const t = useMessages();
  const ready = useIntroDone();
  const sim = useLive();
  const [lang] = useLang();
  const show = (y: number) => (ready ? { opacity: 1, y: 0 } : { opacity: 0, y });
  const stats = [
    { label: t.statRequests, value: sim.requestsToday, accent: false },
    { label: t.statInProgress, value: sim.byState["em-curso"], accent: false },
    { label: t.statPending, value: sim.byState["aguarda-aprovacao"], accent: true },
    { label: t.statDone, value: sim.doneToday, accent: false },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="grid-backdrop pointer-events-none absolute inset-0" />
      <motion.div
        className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, var(--glow), transparent 70%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
        <motion.p
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange"
          initial={{ opacity: 0, y: 8 }}
          animate={show(8)}
          transition={{ duration: 0.5 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-orange" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
          </span>
          {t.live}
        </motion.p>

        <motion.h1
          className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
          initial={{ opacity: 0, y: 18 }}
          animate={show(18)}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          {t.heroTitle}
          <br />
          <span className="text-brand">{t.heroTitleAccent}</span>
        </motion.h1>

        <motion.p
          className="mt-5 max-w-2xl text-lg text-muted"
          initial={{ opacity: 0, y: 12 }}
          animate={show(12)}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {t.heroBody}
        </motion.p>
        <motion.p
          className="mt-3 max-w-2xl text-sm text-muted/80"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {t.heroNote}
        </motion.p>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className={`card relative overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1 ${
                s.accent ? "border-orange/50" : ""
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={show(16)}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
            >
              {s.accent && (
                <div
                  className="pointer-events-none absolute inset-0 opacity-60"
                  style={{ background: "radial-gradient(circle at 100% 0%, var(--glow), transparent 60%)" }}
                />
              )}
              <p className="relative text-sm text-muted">{s.label}</p>
              <p className={`relative mt-2 h-10 overflow-hidden text-4xl font-semibold tabular-nums ${s.accent ? "text-brand" : ""}`}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={sim.now ? s.value : "—"}
                    className="inline-block"
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -24, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {sim.now ? s.value.toLocaleString(lang === "pt" ? "pt-PT" : "en-GB") : "—"}
                  </motion.span>
                </AnimatePresence>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
