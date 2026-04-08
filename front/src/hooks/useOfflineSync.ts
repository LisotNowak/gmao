import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import interventionService from '../services/intervention.service';
import { serverReachableAtom } from '../stores/networkAtom';
import { offlineQueue } from '../utils/offlineQueue';

export function useOfflineSync() {
  const queryClient = useQueryClient();
  const [isOnline] = useAtom(serverReachableAtom);
  const wasOffline = useRef(false);

  useEffect(() => {
    // Marquer comme hors-ligne pour déclencher la sync au retour
    if (!isOnline) {
      wasOffline.current = true;
      return;
    }
    // Déclencher la sync si on revient en ligne (ou au premier connect si queue non vide)
    if (!wasOffline.current && offlineQueue.count() === 0) return;
    wasOffline.current = false;

    const replayQueue = async () => {
      const pending = offlineQueue.getAll();
      if (pending.length === 0) return;

      console.log(`[OfflineSync] ${pending.length} mutation(s) en attente, synchronisation...`);

      let syncedCount = 0;
      for (const item of pending) {
        try {
          if (item.type === 'createIntervention') {
            await interventionService.createInterventionWithoutId(item.payload);
            offlineQueue.remove(item.id);
            syncedCount++;
            console.log(`[OfflineSync] Intervention ${item.id} synchronisée`);
          }
        } catch (error) {
          // On continue avec les items suivants même si l'un échoue
          console.error(`[OfflineSync] Échec pour ${item.id}`, error);
        }
      }

      if (syncedCount > 0) {
        queryClient.invalidateQueries({ queryKey: ['interventions'] });
      }
    };

    replayQueue();
  }, [isOnline, queryClient]);
}
