/**
 * Capa de caché en memoria con deduplicación de promesas en vuelo (In-Flight Request Deduplication).
 * 
 * Evita llamadas redundantes por la red entre navegación de páginas (Dashboard <-> Roadmap <-> Cursos)
 * y unifica llamadas concurrentes idénticas en una sola promesa HTTP compartida.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

export const DEFAULT_CACHE_TTL_MS = 60 * 1000; // 1 minuto por defecto

/**
 * Ejecuta una petición o devuelve el resultado cacheado.
 * Si ya hay una petición idéntica en vuelo, la reutiliza evitando duplicar peticiones de red.
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = DEFAULT_CACHE_TTL_MS
): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  // Deduplicación en vuelo
  const activePromise = inFlightRequests.get(key);
  if (activePromise) {
    return activePromise as Promise<T>;
  }

  const promise = (async () => {
    try {
      const data = await fetcher();
      memoryCache.set(key, {
        data,
        expiresAt: Date.now() + ttlMs,
      });
      return data;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, promise);
  return promise;
}

/**
 * Invalida entradas de caché por clave exacta o prefijo.
 * Si no se especifica argumento, vacía toda la caché.
 */
export function invalidateCache(keyOrPrefix?: string): void {
  if (!keyOrPrefix) {
    memoryCache.clear();
    inFlightRequests.clear();
    return;
  }

  for (const key of memoryCache.keys()) {
    if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
      memoryCache.delete(key);
    }
  }

  for (const key of inFlightRequests.keys()) {
    if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
      inFlightRequests.delete(key);
    }
  }
}
