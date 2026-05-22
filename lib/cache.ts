type CacheEntry = { value: any; expires: number };

const store: Map<string, CacheEntry> = new Map();

export function cacheGet(key: string) {
  const e = store.get(key);
  if (!e) return null;
  if (Date.now() > e.expires) {
    store.delete(key);
    return null;
  }
  return e.value;
}

export function cacheSet(key: string, value: any, ttl = 1000 * 60 * 5) {
  store.set(key, { value, expires: Date.now() + ttl });
}

export function cacheClear() {
  store.clear();
}
