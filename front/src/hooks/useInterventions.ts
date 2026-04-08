import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import interventionService from "../services/intervention.service";
import materialService from "../services/material.service";
import userService from "../services/user.service";
import { serverReachableAtom } from "../stores/networkAtom";
import type { IIntervention, IInterventionFormData, IInterventionHistory } from "../types/IInterventions";
import type { IUserIntervention } from "../types/IUser";
import type {  IUpdateMaterial } from "../types/Imaterial";
import { offlineQueue } from "../utils/offlineQueue";

const interventionKeys = {
  all: ["interventions"] as const,
};

// Création d'intervention (avec gestion offline)
export function useCreateIntervention() {
  const queryClient = useQueryClient();
  const isServerReachable = useAtomValue(serverReachableAtom);

  return useMutation({
    mutationFn: async (data: IInterventionFormData): Promise<{ queued: true } | Awaited<ReturnType<typeof interventionService.createInterventionWithoutId>>> => {
      if (!isServerReachable) {
        offlineQueue.add('createIntervention', data);
        return { queued: true };
      }
      return interventionService.createInterventionWithoutId(data);
    },
    onSuccess: (result) => {
      if ('queued' in result && result.queued) return; // sera synchronisé au retour en ligne
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
    },
  });
}

// Récupérer toutes les interventions
export function useInterventions() { 

   return useQuery({
    queryKey: ['interventions'],
    queryFn: interventionService.getAllInterventions,
    staleTime: 0,
  });
}

// Récupérer interventios atelier
export function useInterventionsAtelier() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['interventionsAtelier'],
    queryFn: interventionService.getAllInterventionsAtelier,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
    }
  }, [query.isSuccess, queryClient]);

  return query;
}

// Récupérer interventions Services généraux
export function useInterventionsSg() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['interventionsSg'],
    queryFn: interventionService.getAllInterventionsSG,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
    }
  }, [query.isSuccess, queryClient]);

  return query;
}

// Récupérer les interventions par status
export function useInterventionsByStatus(statusId: number) {
  return useQuery<IIntervention[], Error>({
    queryKey: ['interventionsByStatus', statusId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      return interventionService.getInterventionsByStatus(id as number);
    },
  });
}

// Récupérer les interventions par matériel
export function useInterventionsByMaterial(materialId: number) {
  return useQuery<IInterventionHistory[], Error>({
    queryKey: ['interventionsByMaterial', materialId],
    queryFn: () => interventionService.getInterventionsByMaterial(materialId),
    enabled: !!materialId,
  });
}

// Modifier une intervention (avec gestion offline)
export function useUpdateIntervention() {
  const queryClient = useQueryClient();
  const isServerReachable = useAtomValue(serverReachableAtom);

  return useMutation({
    mutationFn: async ({ id, data, validation_code }: { id: number; data: Partial<IInterventionFormData>; validation_code: number }): Promise<{ queued: true } | IIntervention> => {
      if (!isServerReachable) {
        offlineQueue.add('updateIntervention', { id, data, validation_code });
        return { queued: true };
      }
      return interventionService.updateIntervention(id, data, validation_code);
    },
    onSuccess: (result) => {
      if ('queued' in result && result.queued) return;
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
    },
  });
}

// Valider une intervention (changer son statut) avec gestion offline
export function useUpdateInterventionStatus() {
  const queryClient = useQueryClient();
  const isServerReachable = useAtomValue(serverReachableAtom);

  return useMutation({
    mutationFn: async ({ id, statusId, validationCode }: { id: number; statusId: number; validationCode: number }): Promise<{ queued: true } | IIntervention> => {
      if (!isServerReachable) {
        offlineQueue.add('updateInterventionStatus', { id, statusId, validationCode });
        return { queued: true };
      }
      return interventionService.updateInterventionStatus(id, statusId, validationCode);
    },
    onSuccess: (result) => {
      if ('queued' in result && result.queued) return;
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
    },
  });
}

// Supprimer une intervention avec gestion offline
export function useDeleteIntervention() {
  const queryClient = useQueryClient();
  const isServerReachable = useAtomValue(serverReachableAtom);

  return useMutation({
    mutationFn: async (id: number): Promise<{ queued: true } | IIntervention> => {
      if (!isServerReachable) {
        offlineQueue.add('deleteIntervention', { id });
        return { queued: true };
      }
      return interventionService.deleteIntervention(id);
    },
    onSuccess: (result) => {
      if ('queued' in result && result.queued) return;
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
    },
  });
}

// Clôturer une intervention avec commentaire final (avec gestion offline)
export function useFinalizationIntervention() {
  const queryClient = useQueryClient();
  const isServerReachable = useAtomValue(serverReachableAtom);

  return useMutation({
    mutationFn: async ({ id, final_comment, validation_code }: { id: number; final_comment: string; validation_code: number }): Promise<{ queued: true } | IIntervention> => {
      if (!isServerReachable) {
        offlineQueue.add('finalizationIntervention', { id, final_comment, validation_code });
        return { queued: true };
      }
      return interventionService.finalizationIntervention(id, final_comment, validation_code);
    },
    onSuccess: (result) => {
      if ('queued' in result && result.queued) return;
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
    },
  });
}

// S'assigner à une intervention (avec gestion offline)
export function useAddUserToIntervention() {
  const queryClient = useQueryClient();
  const isServerReachable = useAtomValue(serverReachableAtom);

  return useMutation({
    mutationFn: async ({ interventionId, validationCode }: { interventionId: number; validationCode: number }): Promise<{ queued: true } | IUserIntervention[]> => {
      if (!isServerReachable) {
        offlineQueue.add('addUsertoIntervention', { interventionId, validationCode });
        return { queued: true };
      }
      return userService.addUsertoIntervention(interventionId, validationCode);
    },
    onSuccess: (result) => {
      if ('queued' in result && result.queued) return;
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
    },
  });
}

// Modifier un matériel
export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedMaterial: IUpdateMaterial) => {
      return await materialService.updateMaterial(updatedMaterial);
    },
    onSuccess: () => {      
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du matériel :", error);
    },
  });
}