import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import categoryService from '../services/category.service';
import localisationService from '../services/localisation.service';
import materialService from '../services/material.service';
import priorityService from '../services/priority.service';
import serviceService from '../services/services.service';
import typeService from '../services/type.service';
import { serverReachableAtom } from '../stores/networkAtom';

export function usePrecache() {
  const queryClient = useQueryClient();
  const [isOnline] = useAtom(serverReachableAtom);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!isOnline) return;

    const prefetch = async () => {
      await Promise.allSettled([
        queryClient.prefetchQuery({ queryKey: ['type'],          queryFn: typeService.getAllTypes }),
        queryClient.prefetchQuery({ queryKey: ['localisations'], queryFn: localisationService.getAllLocalisations }),
        queryClient.prefetchQuery({ queryKey: ['priority'],      queryFn: priorityService.getAllPriority }),
        queryClient.prefetchQuery({ queryKey: ['materials'],     queryFn: materialService.getAllMaterials }),
        queryClient.prefetchQuery({ queryKey: ['category'],      queryFn: categoryService.getAllCategories }),
        queryClient.prefetchQuery({ queryKey: ['services'],      queryFn: serviceService.getAllServices }),
        queryClient.prefetchQuery({ queryKey: ['interventions'], queryFn: () => import('../services/intervention.service').then(m => m.default.getAllInterventions()) }),
      ]);
      hasLoaded.current = true;
    };

    prefetch();
  }, [isOnline, queryClient]);
}
