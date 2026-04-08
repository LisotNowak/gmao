import { atom } from 'jotai';

/**
 * true  = serveur joignable
 * false = serveur inaccessible
 * Mis à jour en temps réel par SocketContext via getDefaultStore()
 */
export const serverReachableAtom = atom<boolean>(false);
