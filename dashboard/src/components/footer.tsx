"use client";

import { useMessages } from "@/lib/preferences";
import { BuildingMark, GitHubIcon, GlobeIcon } from "./icons";
import { useLive } from "./live";

export function Footer() {
  const t = useMessages();
  const { now } = useLive();
  return (
    <footer className="mt-10 border-t border-line">
      <div className="bg-brand h-px opacity-60" />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6">
        <BuildingMark size={36} />
        <p className="text-sm">
          Developed by{" "}
          <a href="https://ividi.dev/" target="_blank" rel="noreferrer" className="focus-ring rounded font-semibold hover:text-orange">
            David Arsénio Martins
          </a>
        </p>
        <div className="flex items-center gap-5 text-sm text-muted">
          <a
            href="https://ividi.dev/"
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 rounded transition-colors hover:text-orange"
          >
            <GlobeIcon width={16} height={16} /> ividi.dev
          </a>
          <a
            href="https://github.com/VidiPT89/"
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 rounded transition-colors hover:text-orange"
          >
            <GitHubIcon width={16} height={16} /> VidiPT89
          </a>
        </div>
        <p className="text-xs text-muted/80">
          ©{now ? ` ${new Date(now).getFullYear()}` : ""} iVidi Studio. {t.footerRights}
        </p>
      </div>
    </footer>
  );
}

