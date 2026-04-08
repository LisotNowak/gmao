import type { IInterventionFormData } from '../types/IInterventions';

const QUEUE_KEY = 'gmao-offline-queue';

export type QueuedMutation = {
  id: string;
  type: 'createIntervention';
  payload: IInterventionFormData;
  timestamp: number;
};

export const offlineQueue = {
  getAll(): QueuedMutation[] {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]');
    } catch {
      return [];
    }
  },

  add(type: QueuedMutation['type'], payload: IInterventionFormData): string {
    const queue = this.getAll();
    // crypto.randomUUID() nécessite HTTPS — fallback compatible HTTP
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    const item: QueuedMutation = {
      id,
      type,
      payload,
      timestamp: Date.now(),
    };
    localStorage.setItem(QUEUE_KEY, JSON.stringify([...queue, item]));
    return item.id;
  },

  remove(id: string): void {
    const queue = this.getAll().filter((i) => i.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  count(): number {
    return this.getAll().length;
  },

  clear(): void {
    localStorage.removeItem(QUEUE_KEY);
  },
};
