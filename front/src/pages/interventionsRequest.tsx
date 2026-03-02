/** biome-ignore-all lint/suspicious/noExplicitAny: <linter capricieux> */
import { mdiAlertCircle, mdiCheckCircleOutline, mdiCloseCircleOutline, mdiTools } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
import ValidateInterventionForm from '../components/Confirmation/confirmWithValidationCode';
import FormInterventionRequest from '../components/Forms/addInterventionForm';
import Header from '../components/Layout/header';
import { useInterventions } from '../hooks/useInterventions';
import { useService } from '../hooks/useService';
import interventionService from '../services/intervention.service';
import type { IIntervention } from '../types/IInterventions';
import { useSocket } from '../utils/SocketContext';

// Config Toasts
type Toast = {
  id: number;
  type: "info" | "success" | "error";
  message: string;
};

type ToastContainerProps = {
  toasts: Toast[];
};

function ToastContainer({ toasts }: ToastContainerProps) {
  return ReactDOM.createPortal(
    <div className="toast fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
      {toasts.map(({ id, type, message }) => (
        <div key={id} className={`alert alert-${type} shadow-lg mb-2`}>
          <span>{message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
}
// Fin config Toasts

const InterventionsRequested = () => {

  const { serviceLabel } = useParams();  
  const { service, isLoading, error } = useService(serviceLabel);
  const [showForm, setShowForm] = useState(false);
  const { data, refetch } = useInterventions();
  const [showValidateForm, setShowValidateForm] = useState(false);
  const [displayInterventions, setDisplayInterventions] = useState<IIntervention[]>([]);
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [filterLessUrgent, setFilterLessUrgent] = useState(false);
  const [toasts, setToasts] = React.useState<
      { id: number; type: "info" | "success" | "error"; message: string }[]
      >([]);  
  const allInterventions: IIntervention[] = Array.isArray(data) ? data : [];
  const socket = useSocket();
  const [selectedInterventionId, setSelectedInterventionId] = useState<number | null>(null);

  // Gérer les urgences des interventions
  const updateDisplayInterventions = useCallback((interventions: IIntervention[]) => {
    if (!service) return;

    let filtered = interventions.filter(
      (i) => i.statusId === 1 && i.serviceId === service.id
    );

    if (filterUrgent) {
      filtered = filtered.filter((i) => i.priorityId === 2);
    } else if (filterLessUrgent) {
      filtered = filtered.filter((i) => i.priorityId === 1);
    };
    setDisplayInterventions(filtered);
  }, [service, filterUrgent, filterLessUrgent]);
  
  useEffect(() => {
    if (Array.isArray(data)) {
      updateDisplayInterventions(data);
    }
  }, [data, updateDisplayInterventions]);
  
// WebSocket
useEffect(() => {
  if (!socket) return; 
  console.log("Socket is connected");

  const handleNew = async() => {    
    const refreshed = await refetch();
    if (refreshed.data) {      
    updateDisplayInterventions(refreshed.data);
    console.log(refreshed.data)
    }
  };

  const handleUpdate = async() => {    
    // refetch();
    console.log("Update event reçu");
     const refreshed = await refetch();
      if (refreshed.data) {
      updateDisplayInterventions(refreshed.data);      
      }
  };

  socket.on("new_intervention", handleNew);
  socket.on("update_status_intervention", handleUpdate);

  return () => {
    socket.off("new_intervention", handleNew);
    socket.off("update_intervention", handleUpdate);
  };
}, [socket, refetch , updateDisplayInterventions]);

  // fonction pour ajouter un toast
  const addToast = (message: string, type: "info" | "success" | "error" = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    // Supprimer automatiquement le toast après 3 secondes
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (!service) return;
    let filtered = allInterventions.filter(
      (i) => i.statusId === 1 && i.serviceId === service.id
    );
    if (filterUrgent) {
      filtered = filtered.filter((i) => i.priorityId === 2);
    }else if(filterLessUrgent){
      filtered = filtered.filter((i) => i.priorityId === 1)
    };
    setDisplayInterventions(filtered);
  }, [allInterventions, service, filterUrgent, filterLessUrgent]);
  
  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement du service</p>;
  if (!service) return <p>Service non trouvé</p>;
  
  const handleValidate = (interventionId: number) => {
    setSelectedInterventionId(interventionId);
    setShowValidateForm(true); 
  };

  const handleValidationSubmit = async (code: number) => {
    if (!selectedInterventionId) return;

    try {
      await interventionService.updateInterventionStatus(selectedInterventionId, 2, code);
      addToast("Intervention validée !", "success");
      setShowValidateForm(false); 
      setSelectedInterventionId(null);
      refetch();
    } catch (error) {
      console.error(error);
      addToast("Erreur lors de la validation", "error");
    }
  };

  const handleDelete = async(interventionId: number)=> {
    const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cette intervention ?");
    if (!confirmed) {    
      return;
    }
    try {
      await interventionService.deleteIntervention(interventionId);     
      addToast("Intervention supprimée avec succès !","success");
      refetch();       
    } catch (error) {
      console.error(error);
      addToast("Erreur lors de la suppression", "error");
    }
  };
 
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="bg-white w-screen">
          <Header />
        </div>
        <main className={`flex-1 overflow-y-auto pt-4 px-4 md:px-8 transition-all duration-300 ${
          showValidateForm ? 'backdrop-blur-lg  pointer-events-none select-none' : 'bg-white'
        }`}>
          <section className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
            <div className='text-center'>
              <h1 className="text-black text-3xl font-bold">
                Demandes d'interventions
              </h1>
            </div>

            <div className="flex lg:justify-end w-full px-4 mt-4 justify-center">
              <div className="flex flex-col items-center pr-0 md:pr-20">
                <button
                  type="button"
                  className="btn btn-circle w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white"
                  onClick={() => setShowForm(true)}
                >
                  <Icon path={mdiTools} size={2} />
                </button>
                <p className="text-black font-bold">Créer intervention</p>
              </div>
            </div>
            <FormInterventionRequest show={showForm} onClose={() => setShowForm(false)} />
          </section>

          <section className="flex flex-col items-center w-full font-bold text-black ">
            <div className="w-3/4 m-4 flex flex-wrap gap-4 justify-center ">
              <button type="button" className="btn btn-error hover:text-white" onClick={() => {setFilterUrgent(true);setFilterLessUrgent(false)}}>
                Très urgent
              </button>
              <button type="button" className="btn btn-warning hover:text-white" onClick={() => {setFilterUrgent(false);setFilterLessUrgent(true)}}>
                Urgent
              </button>
              <button type="button" className={`btn ${!filterUrgent ? 'btn-active' : ''} hover:bg-white hover:text-black`}onClick={() => {setFilterUrgent(false);setFilterLessUrgent(false)}}>
                Toutes
              </button>
            </div>

            <ul className="w-full max-w-6xl flex flex-col gap-2 ">
              {displayInterventions.map((intervention) => (
                <li key={intervention.id} className="collapse bg-gray-100 hover:bg-gray-400  rounded-lg border-4 border-gray-500">
                  <input type="checkbox" />
                  
                  {/* Résumé de l’intervention */}
                  <div className="collapse-title font-semibold px-4 py-2 ">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center w-full">

                      {/* Icône de priorité */}
                      <div className="flex items-center gap-2 items-center">
                        <div className="w-6 h-6 flex items-center justify-center">
                        {intervention.priorityId === 2 && (
                          <Icon path={mdiAlertCircle} size={2.5} className="bg-red-500 text-white rounded-full " />
                        )}
                        {intervention.priorityId === 1 && (
                          <Icon path={mdiAlertCircle} size={2.5} className="bg-orange-400 text-white rounded-full " />
                        )}
                        </div>

                      {/* Titre */}
                        <div className='w-full' >
                          <p className="font-semibold text-gray-600 text-center">Titre</p>
                          <p className=" p-2 bg-gray-200 text-center rounded">{intervention.title}</p>
                        </div>
                      </div>
                      {/* Matériel */}
                      <div className="text-left">
                        <p className="font-semibold text-gray-600 text-center">Matériel concerné :</p>
                        <p className=" p-2 bg-gray-200 rounded text-center">{intervention.materials
                          .map((m) => m.material?.name)
                          .filter(Boolean)
                          .join(", ")}
                          </p>
                      </div>

                      {/* Type */}
                      <div className="text-left">
                        <p className="font-semibold text-gray-600 text-center">Type d'intervention :</p>
                        <p className=" p-2 bg-gray-200 rounded text-center">{intervention.type?.label ?? '—'}</p>
                      </div>
                      {/* Date */}
                      <div className="text-left md:text-right">
                        <p className="font-semibold text-gray-600 text-center">Date de la demande :</p>
                        <p className=" p-2 bg-gray-200 rounded text-center">{new Date(intervention.created_at).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contenu détaillé */}
                  <div className="collapse-content text-sm flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 rounded  text-sm">

                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-600 text-center">Description</p>
                        <p className=" p-2 bg-gray-200 rounded text-center">{intervention.description}</p>
                      </div>

                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-600 text-center">Localisation</p>
                        <p className=" p-2 bg-gray-200 rounded text-center">{intervention.localisation?.label}</p>
                      </div>

                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-600 text-center">Type</p>
                        <p className=" p-2 bg-gray-200 rounded text-center">{intervention.type?.label ?? '—'}</p>
                      </div>

                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-600 text-center">Matériel</p>
                        <p className=" p-2 bg-gray-200 rounded text-center">
                          {intervention.materials.map((m) => m.material?.name).filter(Boolean).join(", ")}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-600">Demandeur</p>
                        <p className=" p-2 bg-gray-200 rounded text-center">{`${intervention.requestor_lastname} ${intervention.requestor_firstname}`}</p>
                      </div>
                      <div className="flex justify-end gap-2 mt-2 px-4">
                      <button type="button" className="btn btn-success hover:text-white" onClick={() => handleValidate(intervention.id)}>
                        <Icon path={mdiCheckCircleOutline} size={1.5} />
                      </button>
                      <button type="button" className="btn btn-error hover:text-white" onClick={() => handleDelete(intervention.id)}>
                        <Icon path={mdiCloseCircleOutline} size={1.5} />
                      </button>
                    </div>
                    </div>                   
                    
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      <ValidateInterventionForm
          show={showValidateForm}
          onClose={() =>{ setShowValidateForm(false);setSelectedInterventionId(null);}}
          onSubmit={handleValidationSubmit}
        />
      <ToastContainer toasts={toasts}/>
    </div>
  );
};

export default InterventionsRequested;