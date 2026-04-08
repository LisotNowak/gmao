import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import interventionService from '../services/intervention.service';
import userService from '../services/user.service';
import { serverReachableAtom } from '../stores/networkAtom';
import { offlineQueue } from '../utils/offlineQueue';

export function useOfflineSync() {
  const queryClient = useQueryClient();
  const [isOnline] = useAtom(serverReachableAtom);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      return;
    }
    // Déclencher la sync si retour en ligne OU au démarrage si queue non vide
    if (!wasOffline.current && offlineQueue.count() === 0) return;
    wasOffline.current = false;

    const replayQueue = async () => {
      const pending = offlineQueue.getAll();
      if (pending.length === 0) return;

      console.log(`[OfflineSync] ${pending.length} mutation(s) en attente, synchronisation...`);

      let syncedCount = 0;
      for (const item of pending) {
        try {
          switch (item.type) {
            case 'createIntervention':
              await interventionService.createInterventionWithoutId(item.payload);
              break;
            case 'updateIntervention':
              await interventionService.updateIntervention(item.payload.id, item.payload.data, item.payload.validation_code);
              break;
            case 'updateInterventionStatus':
              await interventionService.updateInterventionStatus(item.payload.id, item.payload.statusId, item.payload.validationCode);
              break;
            case 'deleteIntervention':
              await interventionService.deleteIntervention(item.payload.id);
              break;
            case 'finalizationIntervention':
              await interventionService.finalizationIntervention(item.payload.id, item.payload.final_comment, item.payload.validation_code);
              break;
            case 'addUsertoIntervention':
              await userService.addUsertoIntervention(item.payload.interventionId, item.payload.validationCode);
              break;
          }
          offlineQueue.remove(item.id);
          syncedCount++;
          console.log(`[OfflineSync] "${item.type}" ${item.id} synchronisé`);
        } catch (error) {
          // On continue avec les items suivants même si l'un échoue
          console.error(`[OfflineSync] Échec pour ${item.type} ${item.id}`, error);
        }
      }

      if (syncedCount > 0) {
        queryClient.invalidateQueries({ queryKey: ['interventions'] });
      }
    };

    replayQueue();
  }, [isOnline, queryClient]);
}
