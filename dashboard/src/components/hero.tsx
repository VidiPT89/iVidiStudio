"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { building } from "@/lib/building";
import { useDayPeriod } from "@/lib/clock";
import { useMessages } from "@/lib/preferences";
import { useIntroDone } from "./intro";

export function Hero() {
  const t = useMessages();
  const ready = useIntroDone();
  const period = useDayPeriod();
  const greeting = {
    morning: t.greetMorning,
    afternoon: t.greetAfternoon,
    evening: t.greetEvening,
  }[period ?? "morning"];
  const show = (y: number) => (ready ? { opacity: 1, y: 0 } : { opacity: 0, y });
  const { byState, total } = building.summary;
  const stats = [
    { label: t.statTotal, value: total, accent: false },
    { label: t.statInProgress, value: byState["em-curso"], accent: false },
    { label: t.statPending, value: byState["aguarda-aprovacao"], accent: true },
    { label: t.statDone, value: byState["concluido"], accent: false },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="grid-backdrop pointer-events-none absolute inset-0" />
      <motion.div
        className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, var(--glow), transparent 70%)" }}
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
        <motion.p
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber"
          initial={{ opacity: 0, y: 8 }}
          animate={show(8)}
          transition={{ duration: 0.5 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-orange" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
          </span>
          {t.heroEyebrow}
        </motion.p>

        <motion.h1
          className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
          initial={{ opacity: 0, y: 18 }}
          animate={show(18)}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={`transition-opacity duration-300 ${period ? "opacity-100" : "opacity-0"}`}>{greeting}</span>
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

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className={`card group relative overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1 ${
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
              <p className={`relative mt-2 text-4xl font-semibold tabular-nums ${s.accent ? "text-brand" : ""}`}>
                <CountUp value={s.value} />
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const ready = useIntroDone();
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || !ready || reduce) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => (node.textContent = String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, ready, value, reduce]);

  return <span ref={ref}>{value}</span>;
}
