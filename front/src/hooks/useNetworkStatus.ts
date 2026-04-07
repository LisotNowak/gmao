import { useAtom } from 'jotai';
import { serverReachableAtom } from '../stores/networkAtom';

/**
 * Retourne true si le serveur backend est joignable.
 * Mis à jour instantanément via Socket.IO (disconnect/connect_error/connect).
 */
export function useNetworkStatus(): boolean {
  const [serverReachable] = useAtom(serverReachableAtom);
  return serverReachable;
}
