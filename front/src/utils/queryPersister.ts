import type { QueryClient } from '@tanstack/react-query';

const STORAGE_KEY = 'gmao-query-cache';
const MAX_AGE_MS  = 24 * 60 * 60 * 1000; // 24 heures

// Clés de queries à persister (lecture seule, pas les mutations)
const PERSISTED_KEYS = ['interventions', 'materials', 'localisations', 'priority', 'type', 'services', 'category'];

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

/** Sauvegarde le cache React Query dans localStorage (avec debounce). */
export function scheduleSave(queryClient: QueryClient) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveToStorage(queryClient);
  }, 2000);
}

function saveToStorage(queryClient: QueryClient) {
  try {
    const allQueries = queryClient.getQueryCache().getAll();
    const toSave = allQueries
      .filter((q) => {
        if (q.state.status !== 'success') return false;
        const key = q.queryKey[0] as string;
        return PERSISTED_KEYS.includes(key);
      })
      .map((q) => ({
        queryKey: q.queryKey,
        data: q.state.data,
        timestamp: Date.now(),
      }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage plein ou indisponible — on ignore
  }
}

/** Restaure le cache React Query depuis localStorage au démarrage. */
export function restoreFromStorage(queryClient: QueryClient) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const items: { queryKey: unknown[]; data: unknown; timestamp: number }[] = JSON.parse(raw);

    for (const item of items) {
      if (Date.now() - item.timestamp > MAX_AGE_MS) continue;
      // Injecte la donnée dans le cache sans déclencher de requête
      queryClient.setQueryData(item.queryKey, item.data);
    }
  } catch {
    // Cache corrompu — on ignore
  }
}
