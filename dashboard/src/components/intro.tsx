"use client";

import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Splash } from "./splash";

const IntroContext = createContext(false);

/** True once the splash has left, so the page's entrance animations play where they can be seen. */
export const useIntroDone = () => useContext(IntroContext);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  const finish = useCallback(() => setDone(true), []);
  return (
    // reducedMotion="user": Motion animations follow the system's "reduce motion" setting too.
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={done}>
        <Splash onDone={finish} />
        {children}
      </IntroContext.Provider>
    </MotionConfig>
  );
}
