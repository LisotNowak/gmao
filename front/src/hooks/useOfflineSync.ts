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
    // On rejoue la queue uniquement au retour en ligne (pas au premier rendu)
    if (!isOnline) {
      wasOffline.current = true;
      return;
    }
    if (!wasOffline.current) return;
    wasOffline.current = false;

    const replayQueue = async () => {
      const pending = offlineQueue.getAll();
      if (pending.length === 0) return;

      console.log(`[OfflineSync] ${pending.length} mutation(s) en attente, synchronisation...`);

      for (const item of pending) {
        try {
          if (item.type === 'createIntervention') {
            await interventionService.createInterventionWithoutId(item.payload);
            offlineQueue.remove(item.id);
            console.log(`[OfflineSync] Intervention ${item.id} synchronisée`);
          }
        } catch (error) {
          console.error(`[OfflineSync] Échec pour ${item.id}`, error);
          break;
        }
      }

      queryClient.invalidateQueries({ queryKey: ['interventions'] });
    };

    replayQueue();
  }, [isOnline, queryClient]);
}
