import { useEffect } from "react";
import type { AtlasAnalyticsEvent } from "../shared/analytics";

const ENDPOINT = "/api/analytics/events";
const AVAILABILITY = "/api/analytics/availability";
const MAX_QUEUE = 25;

export default function AnalyticsTransport() {
  useEffect(() => {
    let available = false;
    let resolved = false;
    let sending = false;
    let queue: AtlasAnalyticsEvent[] = [];
    let stopped = false;

    const flush = async () => {
      if (!resolved || !available || sending || stopped || !queue.length) return;
      sending = true;
      const batch = queue.slice(0, MAX_QUEUE);
      try {
        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(batch),
          credentials: "same-origin",
          keepalive: true,
        });
        if (response.ok) queue = queue.slice(batch.length);
        else if (response.status === 503 || response.status === 404) {
          available = false;
          queue = [];
        }
      } catch {
        // Production collection is optional. Local first-party analytics remains the fallback.
      } finally {
        sending = false;
        if (available && queue.length) void flush();
      }
    };

    const listener = (event: Event) => {
      const custom = event as CustomEvent<AtlasAnalyticsEvent>;
      if (!custom.detail || custom.detail.eventId.startsWith("demo-")) return;
      queue = [...queue, custom.detail].slice(-100);
      void flush();
    };

    window.addEventListener("atlas:analytics", listener);
    void fetch(AVAILABILITY, { credentials: "same-origin", headers: { Accept: "application/json" } })
      .then(async response => response.ok ? response.json() as Promise<{ available?: boolean }> : { available: false })
      .then(result => { available = result.available === true; resolved = true; void flush(); })
      .catch(() => { resolved = true; available = false; queue = []; });

    return () => {
      stopped = true;
      window.removeEventListener("atlas:analytics", listener);
    };
  }, []);

  return null;
}
