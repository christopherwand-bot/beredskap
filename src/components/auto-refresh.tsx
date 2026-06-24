"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

type AutoRefreshProps = {
  intervalMs?: number;
};

export function AutoRefresh({ intervalMs = 30000 }: AutoRefreshProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const lastRefreshAt = useRef(Date.now());

  useEffect(() => {
    function refresh() {
      const now = Date.now();

      if (document.hidden || now - lastRefreshAt.current < intervalMs - 1000) {
        return;
      }

      lastRefreshAt.current = now;

      startTransition(() => {
        router.refresh();
      });
    }

    const interval = window.setInterval(refresh, intervalMs);

    function onVisibilityChange() {
      if (!document.hidden) {
        refresh();
      }
    }

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [intervalMs, router]);

  return (
    <div className="live-refresh" aria-live="polite">
      <span className={`live-dot${isPending ? " is-pending" : ""}`} />
      Oppdateres automatisk
    </div>
  );
}
