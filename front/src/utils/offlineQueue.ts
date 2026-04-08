import type { IInterventionFormData } from '../types/IInterventions';

const QUEUE_KEY = 'gmao-offline-queue';

// Discriminated union de tous les types de mutation supportés hors ligne
export type QueuedMutation =
  | { id: string; type: 'createIntervention';      payload: IInterventionFormData;                                                    timestamp: number }
  | { id: string; type: 'updateIntervention';      payload: { id: number; data: Partial<IInterventionFormData>; validation_code: number }; timestamp: number }
  | { id: string; type: 'updateInterventionStatus';payload: { id: number; statusId: number; validationCode: number };                 timestamp: number }
  | { id: string; type: 'deleteIntervention';      payload: { id: number };                                                           timestamp: number }
  | { id: string; type: 'finalizationIntervention';payload: { id: number; final_comment: string; validation_code: number };           timestamp: number }
  | { id: string; type: 'addUsertoIntervention';   payload: { interventionId: number; validationCode: number };                       timestamp: number };

type MutationType = QueuedMutation['type'];
type PayloadFor<T extends MutationType> = Extract<QueuedMutation, { type: T }>['payload'];

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export const offlineQueue = {
  getAll(): QueuedMutation[] {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]');
    } catch {
      return [];
    }
  },

  add<T extends MutationType>(type: T, payload: PayloadFor<T>): string {
    const queue = this.getAll();
    const item = { id: generateId(), type, payload, timestamp: Date.now() } as QueuedMutation;
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
