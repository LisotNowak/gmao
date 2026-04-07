import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import interventionService from "../services/intervention.service";
import materialService from "../services/material.service";
import type { IIntervention, IInterventionFormData, IInterventionHistory } from "../types/IInterventions";
import type {  IUpdateMaterial } from "../types/Imaterial";
import { offlineQueue } from "../utils/offlineQueue";

const interventionKeys = {
  all: ["interventions"] as const,
};

// Création d'intervention (avec gestion offline)
export function useCreateIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IInterventionFormData): Promise<{ queued: true } | Awaited<ReturnType<typeof interventionService.createInterventionWithoutId>>> => {
      if (!navigator.onLine) {
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