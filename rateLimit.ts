// src/lib/rateLimit.ts
const store = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQ = 30; // e.g. 30 req/min per key

export function checkRateLimit(key: string) {
    const now = Date.now();
    const cur = store.get(key);
    if (!cur || now > cur.resetAt) {
        store.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return { ok: true, remaining: MAX_REQ - 1 };
    }
    if (cur.count >= MAX_REQ) {
        return { ok: false, retryAfter: Math.ceil((cur.resetAt - now) / 1000) };
    }
    cur.count++;
    store.set(key, cur);
    return { ok: true, remaining: MAX_REQ - cur.count };
}
