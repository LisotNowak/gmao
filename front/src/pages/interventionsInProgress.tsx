import { mdiAccountPlusOutline, mdiAlertCircle, mdiCheckCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
import FinalCommentForm from '../components/Forms/finalComment';
import JoinInterventionForm from '../components/Forms/joinInterventionForm';
import Header from '../components/Layout/header';
import UsersAssigned from '../components/Utils/userAssigned';
import { useInterventions } from '../hooks/useInterventions';
import { useService } from '../hooks/useService';
import interventionService from '../services/intervention.service';
import userService from '../services/user.service';
import type { IIntervention } from '../types/IInterventions';
import { useSocket } from '../utils/SocketContext';

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
        <div key={id} className={`alert shadow-lg mb-2 ${
          type === "success" ? "alert-success" :
          type === "error" ? "alert-error" :
          "alert-info"
        }`}>
          <span>{message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
};

const InterventionsInProgress = () => {
     
    const { serviceLabel } = useParams();    
    const { service, isLoading, error } = useService(serviceLabel);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [interventionToJoin, setInterventionToJoin] = useState<number | null>(null);
    const [refreshUserList, setRefreshUserList] = useState<number[]>([]);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [selectedInterventionId, setSelectedInterventionId] = useState<number | null>(null);
    
    const handleOpenCommentForm = (id: number) => {
      setSelectedInterventionId(id);
      setShowCommentForm(true);
    };

    const handleJoinInterventionClick = (id: number) => {
      setInterventionToJoin(id);
      setShowJoinForm(true);
    };

    const handleJoinSubmit = async (validationCode: number) => {
      if (!interventionToJoin) return;
      try {
        await userService.addUsertoIntervention(interventionToJoin, validationCode);
        addToast("Utilisateur ajouté à l’intervention", "success");
        setRefreshUserList((prev) => [...prev, interventionToJoin]);
        refetch(); 
      } catch (error) {
        console.error("Erreur lors de la finalisation :", error);
        addToast("Erreur lors de l'ajout", "error");
      }
    };

    const handleFinalCommentSubmit = async (comment: string, validation_code: number) => {
      if (!selectedInterventionId) return;

      try {
        await interventionService.finalizationIntervention(selectedInterventionId, comment, validation_code);
        addToast("Intervention clôturée avec succès", "success");
        refetch();
      } catch (error) {
        console.error("Erreur lors de la finalisation :", error);
        addToast("Erreur lors de la clôture avec commentaire", "error");
      }
    };

    const [toasts, setToasts] = React.useState<
          { id: number; type: "info" | "success" | "error"; message: string }[]
          >([]);    
    const [displayInterventions, setDisplayInterventions] = useState<IIntervention[]>([]);
    const [filterUrgent, setFilterUrgent] = useState(false);
    const [filterLessUrgent, setFilterLessUrgent] = useState(false);
    const { data, refetch } = useInterventions();
   
    const socket = useSocket();  
    
    const updateDisplayInterventions = useCallback((interventions: IIntervention[]) => {
      if (!service) return;
    
      let filtered = interventions.filter(
        (i) => i.statusId === 2 && i.serviceId === service.id
      );
    
      if (filterUrgent) {
        filtered = filtered.filter((i) => i.priorityId === 2);
      } else if (filterLessUrgent) {
        filtered = filtered.filter((i) => i.priorityId === 1);
      }
    
      setDisplayInterventions(filtered);
    }, [service, filterUrgent, filterLessUrgent]);

    // Initialisation des données à chaque chargement
      useEffect(() => {
        if (Array.isArray(data)) {
          updateDisplayInterventions(data);
        }
      }, [data, updateDisplayInterventions]);

      // WebSocket
      useEffect(() => {
        if (!socket) return; 
        console.log("Socket is connected");      
        
      
        const handleUpdate = async() => {    
          // refetch();
          console.log("Update event reçu");
           const refreshed = await refetch();
            if (refreshed.data) {
            updateDisplayInterventions(refreshed.data);
            console.log(refreshed.data)
      }
        };
      
        socket.on("update_intervention", handleUpdate);
        socket.on("update_status_intervention", handleUpdate);
      
        return () => {          
          socket.off("update_intervention", handleUpdate);
          socket.off("update_status_intervention", handleUpdate);
        };
      }, [socket, refetch , updateDisplayInterventions]);


    if (!service) return <p>Service non trouvé</p>;
    if (isLoading) return <p>Chargement...</p>;
    if (error) return <p>Erreur lors du chargement du service</p>;
    // fonction pour ajouter un toast
    const addToast = (message: string, type: "info" | "success" | "error" = "info") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, message }]);  

      // Supprimer automatiquement le toast après 3 secondes
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 1000);
    };     

    return(
        <div className='max-h-screen '>
        <div className='bg-white w-screen'>
            <Header />
        </div>
        <main className='h-screen pt-4 bg-white pb-10 overflow-auto px-4 md:px-8'>

            <section className='flex flex-col items-center gap-2  '>
                <h1 className='text-black text-3xl font-bold mb-2'>Interventions en cours</h1>
            </section>
            <section className='flex flex-col items-center w-full font-bold pt-10 gap-2 text-black'>
                  <div className='w-full max-w-3xl m-4 flex flex-col justify-center items-center sm:flex-row gap-4'>
                    <button type='button' className="btn btn-error w-1/3 sm:w-auto hover:cursor-pointer" onClick={() => {setFilterUrgent(true);setFilterLessUrgent(false)}}>Très urgent</button>
                    <button type='button' className="btn btn-warning w-1/3 sm:w-auto hover:cursor-pointer" onClick={() => {setFilterUrgent(false);setFilterLessUrgent(true)}}>Urgent</button>
                    <button type='button' className="btn w-1/3 sm:w-auto hover:cursor-pointer" onClick={() => {setFilterUrgent(false);setFilterLessUrgent(false)}}>Toutes les interventions</button>
                  </div>
                
                    {displayInterventions.map((intervention) => 
                      <div key={intervention.id} className="collapse bg-gray-100 border-4 border-gray-500 w-full max-w-6xl  hover:bg-gray-300">
                    
                        <input type="checkbox"  />
                        <div className="collapse-title font-semibold px-4 py-2 ">
                           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center w-full">
                   
                             {/* Icône de priorité */}
                             <div className="flex items-center gap-2 items-center">
                               {/* miniature photo si disponible */}
                               {intervention.picture && (
                                 <img
                                   src={`/api/interventions/${intervention.id}/picture`}
                                   alt="miniature"
                                   className="w-8 h-8 rounded object-cover"
                                 />
                               )}
                               <div className="w-6 h-6 flex items-center justify-center">
                               {intervention.priorityId === 2 && (
                                 <Icon path={mdiAlertCircle} size={2.5} className="bg-red-500 text-white rounded-full  " />
                               )}
                               {intervention.priorityId === 1 && (
                                 <Icon path={mdiAlertCircle} size={2.5} className="bg-orange-400 text-white rounded-full " />
                               )}
                               </div>
                   
                             {/* Titre */}
                               <div className='w-full' >
                                 <p className="font-semibold text-gray-600 text-center">Titre de la demande</p>
                                 <p className=" p-1 bg-gray-200 rounded text-center">{intervention.title}</p>
                               </div>
                             </div>
                             {/* Matériel */}
                             <div className="text-left">
                               <p className="font-semibold text-gray-600 text-center">Matériel concerné</p>
                               <p className=" p-2 bg-gray-200 rounded text-center">{intervention.materials
                                 .map((m) => m.material?.name)
                                 .filter(Boolean)
                                 .join(", ")}
                                 </p>
                             </div>
                   
                             {/* Type */}
                             <div className="text-left">
                               <p className="font-semibold text-gray-600 text-center">Type d'intervention </p>
                               <p className=" p-2 bg-gray-200 rounded text-center">{intervention.type?.label ?? '—'}</p>
                             </div>
                             {/* Date */}
                             <div className="text-left ">
                               <p className="font-semibold text-gray-600 text-center">Date de la demande</p>
                               <p className=" p-2 bg-gray-200 rounded text-center">{new Date(intervention.created_at).toLocaleDateString("fr-FR")}</p>
                             </div>
                           </div>
                         </div>

                         <div className="collapse-content text-sm flex-col gap-4 ">                       

                        <div className="flex flex-col gap-2">
                          <div  className="max-w-1/2 ">
                            <p className="font-semibold text-gray-600 text-center">Description </p>
                            <p className=" p-2 bg-gray-200 rounded text-center">{intervention.description}</p>
                          </div>
                          {intervention.picture && (
                            <div className="flex flex-col items-center">
                              <p className="font-semibold text-gray-600 text-center">Photo</p>
                              <img
                                src={`/api/interventions/${intervention.id}/picture`}
                                alt="Photo intervention"
                                className="max-h-40 max-w-full rounded mt-1 object-contain"
                              />
                            </div>
                          )}
                         
                           <div className="mr-4">
                            <strong>Intervenant :</strong>
                            <UsersAssigned
                              key={`${intervention.id}-${refreshUserList.includes(intervention.id)}`}
                              interventionId={intervention.id}
                            />
                          </div> 
                          <div className='w-full flex justify-center gap-6'>                         
                            <button type='button' className="btn btn-success w-1/6" onClick={() => handleOpenCommentForm(intervention.id)}>
                                <Icon path={mdiCheckCircleOutline} size={1.5} />
                            </button>                           
                            <button type='button' className="btn btn-info w-1/6" onClick={() => handleJoinInterventionClick(intervention.id)}>
                                <Icon path={mdiAccountPlusOutline} size={1.5} />
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </section>
        </main>
        <FinalCommentForm
          show={showCommentForm}
          onClose={() => setShowCommentForm(false)}
          onSubmit={handleFinalCommentSubmit}
        />
        <JoinInterventionForm
          show={showJoinForm}
          onClose={() => setShowJoinForm(false)}
          onSubmit={handleJoinSubmit}
        />
        <ToastContainer toasts={toasts}/>
        </div>
    );
};

export default InterventionsInProgress;


