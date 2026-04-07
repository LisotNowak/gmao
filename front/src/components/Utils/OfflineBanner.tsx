import { useEffect, useState } from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { offlineQueue, type QueuedMutation } from '../../utils/offlineQueue';

const TYPE_LABELS: Record<QueuedMutation['type'], string> = {
  createIntervention: "Création d'intervention",
};

export default function OfflineBanner() {
  const isOnline = useNetworkStatus();
  const [queue, setQueue] = useState<QueuedMutation[]>([]);
  const [expanded, setExpanded] = useState(false);

  // Relire la queue à chaque changement d'état réseau et toutes les 2s
  useEffect(() => {
    const read = () => setQueue(offlineQueue.getAll());
    read();
    const interval = setInterval(read, 2000);
    return () => clearInterval(interval);
  }, [isOnline]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-[10000] shadow-lg transition-all duration-300 ${
      isOnline ? 'bg-emerald-600' : 'bg-red-600'
    }`}>
      {/* Barre principale */}
      <div className="flex items-center justify-between px-4 py-2 text-white text-sm font-semibold">
        <div className="flex items-center gap-2">
          {/* Indicateur rond */}
          <span className={`inline-block w-2.5 h-2.5 rounded-full border-2 border-white ${
            isOnline ? 'bg-white' : 'bg-red-300 animate-pulse'
          }`} />
          {isOnline ? 'En ligne' : 'Hors ligne'}
          {!isOnline && queue.length > 0 && (
            <span className="ml-2 bg-white text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {queue.length} en attente
            </span>
          )}
        </div>

        {/* Bouton pour déplier la file (hors ligne uniquement) */}
        {!isOnline && queue.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-white underline text-xs font-normal"
          >
            {expanded ? 'Masquer' : 'Voir la file d\'attente'}
          </button>
        )}

        {isOnline && queue.length > 0 && (
          <span className="text-xs font-normal opacity-80">
            Synchronisation en cours…
          </span>
        )}
      </div>

      {/* Liste des actions en attente */}
      {!isOnline && expanded && queue.length > 0 && (
        <div className="bg-red-700 px-4 pb-3 text-white text-xs">
          <p className="font-semibold mb-2 opacity-80">Actions en attente d'envoi :</p>
          <ul className="flex flex-col gap-1">
            {queue.map((item) => (
              <li key={item.id} className="flex items-start gap-2 bg-red-800 rounded px-3 py-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-orange-300 flex-shrink-0" />
                <div>
                  <span className="font-semibold">{TYPE_LABELS[item.type]}</span>
                  {item.payload.title && (
                    <span className="ml-1 opacity-80">— {item.payload.title}</span>
                  )}
                  <div className="opacity-60 mt-0.5">
                    {new Date(item.timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 opacity-70 italic">Ces demandes seront envoyées automatiquement à la reconnexion.</p>
        </div>
      )}
    </div>
  );
}
