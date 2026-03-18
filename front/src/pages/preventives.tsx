import { mdiCalendarMonth, mdiCheckAll, mdiCheckCircleOutline, mdiPencil, mdiSync, mdiTools, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useParams } from 'react-router-dom';
import ConfirmModal from '../components/Confirmation/ConfirmModal';
import ValidateInterventionForm from '../components/Confirmation/confirmWithValidationCode';
import FormPreventiveRequest from '../components/Forms/addPrevntiveForm';
import FinalPreventiveForm from '../components/Forms/finalizePreventive';
import Header from '../components/Layout/header';
import SearchBarMaterial from '../components/SearchBars/searchbarMaterial';
import { useAllMaterials } from '../hooks/useMaterials';
import { useDeletePreventive, usePreventives } from '../hooks/usePreventive';
import { useService } from '../hooks/useService';
import { useAddUserToPreventive } from '../hooks/useUser';
import preventiveService from '../services/preventive.service';
import type { IMaterial } from '../types/Imaterial';
import type { IUpdatePreventive } from '../types/IPreventive';

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

const InterventionsPreventives = () => {
    const [toasts, setToasts] = React.useState<
          { id: number; type: "info" | "success" | "error"; message: string }[]
          >([]);  

    // fonction pour ajouter un toast
  const addToast = (message: string, type: "info" | "success" | "error" = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]); 
    // Supprimer automatiquement le toast après 3 secondes
    setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

    const { serviceLabel } = useParams();
    const { service } = useService(serviceLabel);
    const [showForm, setShowForm] = useState(false);
    const {data : preventivesData, refetch} = usePreventives();    
    const [preventives, setPreventives] = useState(preventivesData ?? []);
    const [selectedMaterial, setSelectedMaterial] = useState<IMaterial | null>(null);
    const { data: materialsData, } = useAllMaterials();
    const allMaterials: IMaterial[] = Array.isArray(materialsData) ? materialsData : [];
    const [_materials, setMaterials] = useState<IMaterial[]>([]);
    const [filterMode, setFilterMode] = useState<'soon' | 'all' | 'in_progress'>('soon');
    const filteredPreventives = selectedMaterial
        ? preventives?.filter(preventive =>
            preventive.materialLinks.some(link => link.material.id === selectedMaterial.id)
            )
        : preventives?.filter(preventive => {
            const preventiveDate = preventive.date ? new Date(preventive.date) : null;
            const now = new Date();
            const twoWeeksFromNow = new Date();
            twoWeeksFromNow.setDate(now.getDate() + 14);

            const isSameService = preventive.materialLinks.some(link => link.material.serviceId === service?.id);
            if (!preventiveDate || !isSameService) return false;

            if (filterMode === 'soon') {
                // StatusId 1 = demandé
                 return preventive.statusId === 1 && (preventiveDate <= twoWeeksFromNow)
            }else if (filterMode === 'in_progress') {
            // StatusId 2 = en cours
            return preventive.statusId === 2;
            }else {
                return  preventive.statusId === 1 || preventive.statusId === 2;
            }
        });

    filteredPreventives?.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : Infinity;
        const dateB = b.date ? new Date(b.date).getTime() : Infinity;
        return dateA - dateB; // ordre croissant
    });

    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);      
    const [preventiveToDelete, setPreventiveToDelete] = useState<{ id: number } | null>(null);
    const deletePreventiveMutation = useDeletePreventive();
    const [editValuesMap, setEditValuesMap] = useState<Record<number, Partial<IUpdatePreventive>>>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedInterventionId, setSelectedInterventionId] = useState<number | null>(null);
    const [showValidateForm, setShowValidateForm] = useState(false);
    const addUserMutation = useAddUserToPreventive();

    useEffect(() => {
        if (Array.isArray(materialsData)) {
            setMaterials(materialsData);
        };
    }, [materialsData]);

    useEffect(() => {
        if (preventivesData) {
            setPreventives(preventivesData);
        }
    }, [preventivesData]);

    // Ajouter un utilisateur à un préventof : 
    function handleAddUser(preventiveId: number, code: number) {
        addUserMutation.mutate(
            { preventiveId, validationCode: code },
            {
            onSuccess: ({ message, relation }) => {
                console.log(message);
                console.log("Utilisateur ajouté :", relation.user.firstname);
            },
            onError: (error) => {
                console.error("Erreur :", error.message);
            },
            }
        );
    }

    // Afficher le formulaire de validation
    const handleValidate = (interventionId: number) => {
        setSelectedInterventionId(interventionId);
        setShowValidateForm(true); 
    };

    const handleValidateEnd = (interventionId: number) => {
        setSelectedInterventionId(interventionId);
        setShowCommentForm(true); 
    };

    // Valider la prise en chage d'un préventif
    const handleValidationSubmit = async (code: number) => {
        if (!selectedInterventionId) return;    

        try {
            await handleAddUser(selectedInterventionId, code);
            await preventiveService.updateStatusPreventive(selectedInterventionId, 2,code);
            addToast("Intervention validée !", "success");
            setShowValidateForm(false); // Fermer le formulaire
            setSelectedInterventionId(null);
            refetch();
        } catch (error) {
            console.error(error);
            addToast("Erreur lors de la validation", "error");
        }
    };

    //Clôturer un préventif 
    const handleFinalCommentSubmit = async (code: number) => {
        if (!selectedInterventionId) return;

        try {
            await preventiveService.updateStatusPreventive(selectedInterventionId, 3,code);
            addToast("Intervention validée !", "success");
            setShowValidateForm(false); // Fermer le formulaire
            setSelectedInterventionId(null);
            refetch();
        } catch (error) {
            console.error(error);
            addToast("Erreur lors de la validation", "error");
        }
    };

     // Supprime un préventif
    const handleDelete = (id: number) => {
        setPreventiveToDelete({ id });
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        if (preventiveToDelete) {
            deletePreventiveMutation.mutate(preventiveToDelete.id);
            setPreventiveToDelete(null);
            setShowConfirmModal(false);
        }
    };

    const cancelDelete = () => {
        setPreventiveToDelete(null);
        setShowConfirmModal(false);
    };

    const formatDate = (date: string | Date | undefined): string => {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toISOString().split('T')[0]; // renvoie "YYYY-MM-DD"
    };
    
    // Pour affichage lisible en texte
    function formatDateDisplay(date: string | Date): string {
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString();
    };    

    return(
        <div className='max-h-screen'>
            <div className='bg-white w-screen'>
                <Header />
            </div>
        <main className='min-h-screen pt-4 bg-white pb-4'>

             <section className="flex flex-col items-center w-full">
                    <div>
                        <h1 className="text-black text-3xl font-bold mb-4">Entretiens préventifs</h1> 
                        <SearchBarMaterial onSelect={(id) => {
                            const found = allMaterials.find((m) => m.id === id);
                            if (found) {
                            setSelectedMaterial(found);
                            }
                        }}/>
                         {selectedMaterial && (
                            <div className="text-center mt-2">
                                <button
                                type='button'
                                onClick={() => setSelectedMaterial(null)}
                                className="btn btn-outline text-black btn-sm hover:text-white"
                                >
                                Réinitialiser la recherche
                                </button>
                            </div>
                        )}
                                          
                    </div>
            
                    <div className="flex justify-end w-full px-4 ">
                        <div className="flex flex-col items-center pr-10">
                            <Link to={`/calendrier/${serviceLabel}`}>
                            <div className='flex flex-col items-center text-center'>
                            <button
                                type="button"
                                className="btn btn-circle w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white"
                            >
                                <Icon path={mdiCalendarMonth} size={2} />
                            </button>
                            <p className="text-black">Calendrier préventif</p>
                            </div>
                            </Link>
                        </div>

                        <div className="flex flex-col items-center pr-20">
                            <button
                                type="button"
                                className="btn btn-circle w-15 h-15 btn-accent hover:bg-accent-focus hover:text-white"
                                onClick={() => setShowForm(true)}
                            >
                                <Icon path={mdiTools} size={2} />
                            </button>
                            <p className="text-black">Créer préventif</p>
                        </div>
                    </div>
            </section>

            <section className='flex flex-col items-center w-full font-bold  gap-2 text-black'>

                 <div className='w-3/4 m-4 flex gap-4 '>
                    <button type='button'  className={`btn bg-black text-white  hover:text-black hover:bg-white ${filterMode === 'soon' ? 'btn-active' : ''}`}
                         onClick={() => setFilterMode('soon')}>Prochainement</button>
                         <button type='button'  className={`btn bg-black text-white  hover:text-black hover:bg-white ${filterMode === 'in_progress' ? 'btn-active' : ''}`}
                         onClick={() => setFilterMode('in_progress')}>En cours</button>
                    <button type='button'className={`btn bg-black text-white  hover:text-black hover:bg-white ${filterMode === 'all' ? 'btn-active' : ''}`}
                        onClick={() => setFilterMode('all')}>Tous</button>
                    
                </div>

                    {filteredPreventives?.map((preventive) => (
                    <div
                        key={preventive.id}
                        className={`border-4 w-3/4 mx-auto my-2 rounded shadow transition-colors ${preventive.is_recurring ? 'bg-blue-50 border-blue-400 hover:bg-blue-100' : 'bg-gray-100 border-gray-500 hover:bg-gray-400'}`}
                    >
                        {/* Boutons modifier / supprimer alignés à droite */}
                        <div className="flex justify-between items-center gap-2 p-2">
                        {preventive.is_recurring && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">
                                <Icon path={mdiSync} size={0.7} />
                                Récurrent · tous les {preventive.recurrence_days}j
                            </span>
                        )}
                        {!preventive.is_recurring && <span />}
                            {preventive.statusId === 3 ? (                                
                                <span className="px-3 py-1 bg-gray-600 text-white rounded flex items-center gap-1">
                                <Icon path={mdiCheckAll} size={1.2} />
                                Terminée
                                </span>
                            ) : preventive.statusId === 2 ? (                               
                                <button
                                type="button"
                                className="btn btn-success hover:text-white "                                
                                title="Entretien clôturé"
                                onClick={() => handleValidateEnd(preventive.id)}
                                >
                               <Icon path={mdiCheckAll} size={1.2} />
                               En cours
                                </button>
                            ) : (
                                // Bouton Valider quand statusId !== 2
                                <button
                                type="button"
                                className="btn btn-success hover:text-white"
                                onClick={() => handleValidate(preventive.id)}
                                >
                                <Icon path={mdiCheckCircleOutline} size={1.5} />
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn-warning flex items-center gap-1 px-3 py-1 text-sm hover:text-white"
                                onClick={() => {
                                if (editingId === preventive.id) {
                                    setEditingId(null);
                                } else {
                                    setEditingId(preventive.id);
                                    setEditValuesMap((prev) => ({
                                    ...prev,
                                    [preventive.id]: {
                                        title: preventive.title,
                                        description: preventive.description,
                                        date: preventive.date,
                                    },
                                    }));
                                }
                                }}
                            >
                                <Icon path={mdiPencil} size={1.2} />
                                
                            </button>
                            <button
                                type="button"
                                className="btn btn-error flex items-center gap-1 px-3 py-1 text-sm hover:text-white"
                                onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(preventive.id);
                                }}
                            >
                                <Icon path={mdiTrashCanOutline} size={1.2} />
                                
                            </button>
                        </div>

                        {/* Contenu éditable ou affichage */}
                        <div className="px-4 pb-4 grid grid-cols-2 gap-4">
                            {editingId === preventive.id ? (
                                <>
                                {/* Titre */}
                                <div className="flex flex-col">
                                    <label
                                    htmlFor={`title-${preventive.id}`}
                                    className="mb-1 font-semibold text-gray-700 "
                                    >
                                    Titre
                                    </label>
                                    <input
                                    id={`title-${preventive.id}`}
                                    type="text"
                                    className="input input-bordered bg-white text-black"
                                    value={editValuesMap[preventive.id]?.title ?? preventive.title}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                        setEditValuesMap((prev) => ({
                                        ...prev,
                                        [preventive.id]: {
                                            ...prev[preventive.id],
                                            title: e.target.value,
                                        },
                                        }))
                                    }
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col">
                                    <label
                                    htmlFor={`description-${preventive.id}`}
                                    className="mb-1 font-semibold text-gray-700"
                                    >
                                    Description
                                    </label>
                                    <input
                                    id={`description-${preventive.id}`}
                                    type="text"
                                    className="input input-bordered bg-white text-black"
                                    value={
                                        editValuesMap[preventive.id]?.description ??
                                        preventive.description
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                        setEditValuesMap((prev) => ({
                                        ...prev,
                                        [preventive.id]: {
                                            ...prev[preventive.id],
                                            description: e.target.value,
                                        },
                                        }))
                                    }
                                    />
                                </div>

                                {/* Matériel concerné */}
                                <div className="flex flex-col">
                                    <label
                                    htmlFor={`material-${preventive.id}`}
                                    className="mb-1 font-semibold text-gray-700"
                                    >
                                    Matériel concerné
                                    </label>
                                    <input
                                    id={`material-${preventive.id}`}
                                    type="text"
                                    className="input input-bordered bg-white text-black"
                                    value={preventive.materialLinks
                                        .map((link) => link.material.name)
                                        .join(", ")}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => {}}
                                    readOnly
                                    />
                                </div>

                                {/* Date d'échéance */}
                                <div className="flex flex-col">
                                    <label
                                    htmlFor={`date-${preventive.id}`}
                                    className="mb-1 font-semibold text-gray-700 "
                                    >
                                    À effectuer avant le
                                    </label>
                                    <input
                                    id={`date-${preventive.id}`}
                                    type="date"
                                    className="input input-bordered bg-white text-black"
                                    value={formatDate(editValuesMap[preventive.id]?.date ?? preventive.date)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                        setEditValuesMap((prev) => ({
                                        ...prev,
                                        [preventive.id]: {
                                            ...prev[preventive.id],
                                            date: new Date(e.target.value),
                                        },
                                        }))
                                    }
                                    />
                                </div>

                                {/* Bouton enregistrer */}
                                <div className="flex justify-end pt-2 col-span-2">
                                    <button
                                    type="button"
                                    className="btn btn-success px-4 py-1 hover:text-white"
                                    onClick={() => {
                                        const updated = editValuesMap[preventive.id];
                                        preventiveService
                                            .updatePreventive({ id: preventive.id, ...updated })
                                            .then((_updatedPreventive) => {
                                            setEditingId(null);
                                            setEditValuesMap((prev) => {
                                                const copy = { ...prev };
                                                delete copy[preventive.id];
                                                return copy;
                                            });
                                            
                                            // Mise à jour locale de la liste
                                            setPreventives((prevList) => prevList.map(p => p.id === preventive.id ? {...p, ...updated} : p));
                                            });
                                    }}
                                    >
                                    Enregistrer
                                    </button>
                                </div>
                                </>
                            ) : (
                            <>
                            {/* Affichage non éditable */}
                                <div>
                                    <p className='text-center'>Titre</p>
                                    <p className="p-2 bg-gray-200 rounded w-full text-center">{preventive.title}</p>
                                </div>
                                <div>
                                    <p className='text-center'>Description</p>
                                    <p className=" p-2 bg-gray-200 rounded w-full text-center">{preventive.description}</p>
                                </div>
                                <div>
                                    <p className='text-center'>Matériel concerné</p>
                                    <p className=" p-2 bg-gray-200 rounded w-full text-center">
                                    {preventive.materialLinks.map((link) => link.material.name).join(", ")}
                                </p>
                                </div>
                                <div>
                                    <p className='text-center'>À effectuer avant le</p>
                                    <p className=" p-2 bg-gray-200 rounded w-full text-center">{formatDateDisplay(preventive.date)}</p>
                                </div>
                                <div>
                                    <p className='text-center'>Intervenant</p>
                                    <p className=" p-2 bg-gray-200 rounded w-full text-center">
                                    {preventive.users?.[0]?.user
                                        ? `${preventive.users[0].user.firstname} ${preventive.users[0].user.lastname}`
                                        : "Aucun intervenant"}
                                    </p>
                                </div>  
                                {preventive.statusId === 3 && preventive.updated_at && (
                                <div>
                                    <p className="text-center">Effectué le </p>
                                    <p className="p-2 bg-gray-200 rounded w-full text-center">
                                    {formatDateDisplay(preventive.updated_at)}
                                    </p>
                                </div>
                                )}                      
                            </>
                            )}
                        </div>
                    </div>
                    ))}       
                 
            </section>
                <ConfirmModal
                    show={showConfirmModal}
                    title="Confirmer la suppression"
                    message={`Confirmer la suppression ?`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
                <FormPreventiveRequest show={showForm} onClose={() => setShowForm(false)} />
                <ValidateInterventionForm
                    show={showValidateForm}
                    onClose={() =>{ setShowValidateForm(false);setSelectedInterventionId(null);}}
                    onSubmit={handleValidationSubmit}
                />
                <FinalPreventiveForm
                    show={showCommentForm}
                    onClose={() => setShowCommentForm(false)}
                    onSubmit={handleFinalCommentSubmit}
                />
                <ToastContainer toasts={toasts}/>
            </main>
        </div>
    );
};

export default InterventionsPreventives;