/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <Linter capricieux> */
import { mdiAlertCircle, mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Layout/header';
import { useInterventions } from '../hooks/useInterventions';
import { useService } from '../hooks/useService';
import type { IIntervention } from '../types/IInterventions';
import { useSocket } from '../utils/SocketContext';

const STATUS_LABELS: Record<number, string> = {
  1: 'Demandée',
  2: 'En cours',
  3: 'Clôturée',
};

const STATUS_BADGE: Record<number, string> = {
  1: 'badge-warning',
  2: 'badge-info',
  3: 'badge-success',
};

const InterventionHistory = () => {
  const { serviceLabel } = useParams();
  const { service, isLoading, error } = useService(serviceLabel);
  const { data, refetch } = useInterventions();
  const socket = useSocket();

  const [filterStatus, setFilterStatus] = useState<number | null>(null);
  const [filterPriority, setFilterPriority] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [displayInterventions, setDisplayInterventions] = useState<IIntervention[]>([]);

  const updateDisplay = useCallback(
    (interventions: IIntervention[]) => {
      if (!service) return;

      let filtered = interventions.filter((i) => i.serviceId === service.id);

      if (filterStatus !== null) {
        filtered = filtered.filter((i) => i.statusId === filterStatus);
      }

      if (filterPriority !== null) {
        filtered = filtered.filter((i) => i.priorityId === filterPriority);
      }

      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.title?.toLowerCase().includes(q) ||
            i.description?.toLowerCase().includes(q) ||
            i.requestor_lastname?.toLowerCase().includes(q) ||
            i.requestor_firstname?.toLowerCase().includes(q)
        );
      }

      filtered.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setDisplayInterventions(filtered);
    },
    [service, filterStatus, filterPriority, searchText]
  );

  useEffect(() => {
    if (Array.isArray(data)) {
      updateDisplay(data);
    }
  }, [data, updateDisplay]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = async () => {
      const refreshed = await refetch();
      if (refreshed.data) updateDisplay(refreshed.data);
    };
    socket.on('new_intervention', handleUpdate);
    socket.on('update_intervention', handleUpdate);
    socket.on('update_status_intervention', handleUpdate);
    return () => {
      socket.off('new_intervention', handleUpdate);
      socket.off('update_intervention', handleUpdate);
      socket.off('update_status_intervention', handleUpdate);
    };
  }, [socket, refetch, updateDisplay]);

  if (!service) return <p>Service non trouvé</p>;
  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement</p>;

  return (
    <div className="max-h-screen">
      <div className="bg-white w-screen">
        <Header />
      </div>

      <main className="min-h-screen pt-4 bg-white pb-10 overflow-auto px-4 md:px-8">
        <section className="flex flex-col items-center gap-2">
          <h1 className="text-black text-3xl font-bold mb-2">Historique des interventions</h1>
        </section>

        {/* Filtres */}
        <section className="flex flex-col items-center w-full font-bold pt-6 gap-3 text-black">

          {/* Recherche texte */}
          <div className="w-full max-w-xl relative">
            <Icon
              path={mdiMagnify}
              size={1}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Rechercher par titre, description, demandeur…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 bg-white text-black font-normal"
            />
          </div>

          {/* Filtre statut */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              className={`btn btn-sm ${filterStatus === null ? 'btn-neutral text-white' : 'btn-outline'}`}
              onClick={() => setFilterStatus(null)}
            >
              Tous les statuts
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterStatus === 1 ? 'btn-warning' : 'btn-outline btn-warning'}`}
              onClick={() => setFilterStatus(filterStatus === 1 ? null : 1)}
            >
              Demandées
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterStatus === 2 ? 'btn-info' : 'btn-outline btn-info'}`}
              onClick={() => setFilterStatus(filterStatus === 2 ? null : 2)}
            >
              En cours
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterStatus === 3 ? 'btn-success' : 'btn-outline btn-success'}`}
              onClick={() => setFilterStatus(filterStatus === 3 ? null : 3)}
            >
              Clôturées
            </button>
          </div>

          {/* Filtre priorité */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              className={`btn btn-sm ${filterPriority === null ? 'btn-neutral text-white' : 'btn-outline'}`}
              onClick={() => setFilterPriority(null)}
            >
              Toutes priorités
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterPriority === 2 ? 'btn-error' : 'btn-outline btn-error'}`}
              onClick={() => setFilterPriority(filterPriority === 2 ? null : 2)}
            >
              Très urgent
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterPriority === 1 ? 'btn-warning' : 'btn-outline btn-warning'}`}
              onClick={() => setFilterPriority(filterPriority === 1 ? null : 1)}
            >
              Urgent
            </button>
          </div>

          <p className="text-gray-500 font-normal text-sm">
            {displayInterventions.length} intervention(s) trouvée(s)
          </p>
        </section>

        {/* Liste des interventions */}
        <section className="flex flex-col items-center w-full gap-2 mt-4">
          {displayInterventions.length === 0 && (
            <p className="text-gray-500 mt-10">Aucune intervention trouvée.</p>
          )}

          {displayInterventions.map((intervention) => (
            <div
              key={intervention.id}
              className="collapse bg-gray-100 border-4 border-gray-500 w-full max-w-6xl hover:bg-gray-300"
            >
              <input type="checkbox" />

              {/* Titre de la carte */}
              <div className="collapse-title font-semibold px-4 py-2">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-center w-full">

                  {/* Photo + Priorité + Titre */}
                  <div className="flex items-center gap-2 col-span-2">
                    {intervention.picture && (
                      <img
                        src={`/api/interventions/${intervention.id}/picture`}
                        alt="miniature"
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {intervention.priorityId === 2 && (
                        <Icon path={mdiAlertCircle} size={1.5} className="text-red-500" />
                      )}
                      {intervention.priorityId === 1 && (
                        <Icon path={mdiAlertCircle} size={1.5} className="text-orange-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-600 text-xs text-center">Titre</p>
                      <p className="p-1 bg-gray-200 rounded text-center text-sm truncate">
                        {intervention.title}
                      </p>
                    </div>
                  </div>

                  {/* Statut */}
                  <div className="text-center">
                    <p className="font-semibold text-gray-600 text-xs text-center">Statut</p>
                    <span
                      className={`badge ${STATUS_BADGE[intervention.statusId ?? 0] ?? 'badge-ghost'} text-white font-bold px-3 py-2 text-xs`}
                    >
                      {STATUS_LABELS[intervention.statusId ?? 0] ?? '—'}
                    </span>
                  </div>

                  {/* Type */}
                  <div>
                    <p className="font-semibold text-gray-600 text-xs text-center">Type</p>
                    <p className="p-1 bg-gray-200 rounded text-center text-sm">
                      {intervention.type?.label ?? '—'}
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="font-semibold text-gray-600 text-xs text-center">Date</p>
                    <p className="p-1 bg-gray-200 rounded text-center text-sm">
                      {new Date(intervention.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contenu étendu */}
              <div className="collapse-content text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="font-semibold text-gray-600 text-center">Description</p>
                    <p className="p-2 bg-gray-200 rounded text-center">{intervention.description}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-600 text-center">Demandeur</p>
                    <p className="p-2 bg-gray-200 rounded text-center">
                      {intervention.requestor_lastname} {intervention.requestor_firstname}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-600 text-center">Localisation</p>
                    <p className="p-2 bg-gray-200 rounded text-center">
                      {intervention.localisation?.label ?? '—'}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-600 text-center">Matériel concerné</p>
                    <p className="p-2 bg-gray-200 rounded text-center">
                      {intervention.materials
                        .map((m) => m.material?.name)
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </p>
                  </div>

                  {intervention.final_comment && (
                    <div className="col-span-1 md:col-span-2">
                      <p className="font-semibold text-gray-600 text-center">Commentaire final</p>
                      <p className="p-2 bg-gray-200 rounded text-center italic">
                        {intervention.final_comment}
                      </p>
                    </div>
                  )}

                  {intervention.picture && (
                    <div className="col-span-1 md:col-span-2 flex flex-col items-center">
                      <p className="font-semibold text-gray-600 text-center">Photo</p>
                      <img
                        src={`/api/interventions/${intervention.id}/picture`}
                        alt="Photo intervention"
                        className="max-h-40 max-w-full rounded mt-1 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default InterventionHistory;
