/**
 * Provider-agnostic product events. Pages and components call `track()`; adapters decide where an event
 * goes. The only built-in adapter forwards to GA4 when it is configured (see components/analytics).
 * Events never contain the visitor's location, saved items or history; search events carry the query text only,
 * so "most searched" and "zero-result searches" can be answered later.
 */
export type AppEvent =
  | { name: "search"; query: string; results: number }
  | { name: "search_no_results"; query: string }
  | { name: "view_entity"; entity: "medicine" | "hospital" | "pharmacy" | "doctor" | "specialty" | "location"; slug: string }
  | { name: "save_toggle"; entity: string; saved: boolean }
  | { name: "share"; method: "native" | "copy" }
  | { name: "use_my_location"; outcome: "granted" | "denied" | "unavailable" };

type Adapter = (event: AppEvent) => void;
const adapters: Adapter[] = [];

export function registerAnalyticsAdapter(adapter: Adapter): () => void {
  adapters.push(adapter);
  return () => {
    const index = adapters.indexOf(adapter);
    if (index >= 0) adapters.splice(index, 1);
  };
}

function toGtagParams(event: AppEvent): Record<string, string | number | boolean> {
  const { name: _name, ...rest } = event;
  void _name;
  return rest as Record<string, string | number | boolean>;
}

/** GA4 adapter: a no-op unless gtag has been loaded (it only loads with a measurement id, never on previews). */
function gtagAdapter(event: AppEvent): void {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", event.name, toGtagParams(event));
}

export function track(event: AppEvent): void {
  if (typeof window === "undefined") return;
  try {
    gtagAdapter(event);
    for (const adapter of adapters) adapter(event);
  } catch {
    // Analytics must never break a page.
  }
}
