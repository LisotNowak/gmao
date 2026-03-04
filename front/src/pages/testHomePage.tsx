/** biome-ignore-all assist/source/organizeImports: <Linter> */
import { mdiAlert, mdiCalendarClock, mdiCalendarPlus, mdiCartVariant, mdiCog, mdiHistory, mdiMessageAlert, mdiProgressWrench, mdiTools } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useParams } from 'react-router-dom';
import FormInterventionRequest from "../components/Forms/addInterventionForm";
import { useInterventions, } from '../hooks/useInterventions';
import { useService } from "../hooks/useService";
import type { IIntervention } from '../types/IInterventions';
import Header from "../components/Layout/header";
import { useSocket } from "../utils/SocketContext";
import FormMaterialRequest from "../components/Forms/addMaterialForm";
import type { IPreventive } from "../types/IPreventive";
import { usePreventives } from "../hooks/usePreventive";
import FormPreventiveRequest from "../components/Forms/addPrevntiveForm";

const TestHomePage = () => {
    // Récupérer le label du service dans l'url
    const { serviceLabel } = useParams();
    // Récupérer le service concerné
    const { service, isLoading, error } = useService(serviceLabel);

    const [showFormPreventive, setShowFormPreventive] = useState(false)
    const [showForm, setShowForm] = useState(false);
    // Récupérer toutes les interventions
    const { data, refetch } = useInterventions(); 
    const {data: preventives} = usePreventives();
    const [showFormMaterial, setShowFormMaterial] = useState(false);
    const socket = useSocket();
    const refetchRef = useRef(refetch);

    useEffect(() => {
        refetchRef.current = refetch;
    }, [refetch]);

    // Initialiser socket.io à l’arrivée sur la page
    useEffect(() => {
        if (!socket) return;  

        //Quand le backend annonce qu'il y a une nouvelle intervention
        socket.on("new_intervention", (payload) => {
            console.log("📬 Nouvelle intervention reçue :", payload);
            refetchRef.current(); //Recharger les interventions depuis le serveur
        });

        //Quand une intervention est mise à jour
        socket.on("update_status_intervention", (payload) => {
            console.log("🔧 Intervention mise à jour :", payload);
            refetchRef.current()
        });

        //Quand une intervention est mise à jour 
        socket.on("update_intervention", (payload) => {
            console.log("🔧 Intervention mise à jour :", payload);
            refetchRef.current()
        });

        return () => {
        socket.off("new_intervention");
        socket.off("update_status_intervention");
        socket.off("update_intervention")
        };
    }, [socket]);

    if (!service) return <p>Service non trouvé</p>;
    if (isLoading) return <p>Chargement...</p>;
    if (error) return <p>Erreur lors du chargement du service</p>;   

    const allInterventions: IIntervention[] = Array.isArray(data) ? data : [];
    const allPreventives: IPreventive[] = Array.isArray(preventives) ? preventives : [];        
    const requestedInterventions = allInterventions.filter((intervention) => intervention.statusId === 1  && intervention.serviceId === service?.id) ;
    const inProgressInterventions = allInterventions.filter((intervention) => intervention.statusId === 2  && intervention.serviceId === service?.id) ;
    const preventivesInterventions = allPreventives.filter((preventive) => {
        if (preventive.serviceId !== service?.id) return false;
        if (preventive.statusId !== 1) return false;

        const preventiveDate = new Date(preventive.date); 
        const now = new Date();
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(now.getDate() + 14);

        return preventiveDate >= now && preventiveDate <= twoWeeksLater;
    });    

    return(
        
        <main className="flex flex-col  min-h-screen overflow-x-hidden bg-white px-4 md:px-8">
                <div className=" w-full ">
                    <Header />
                </div>        

            <section className="  flex flex-col justify-center items-center w-full max-w-full grow ">

                <div className="flex justify center">
                    <h1 className="font-bold text-black text-4xl">Tableau de bord</h1>
                </div>

                {/* Boutons d'action */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-y-6 gap-x-4 mt-5 px-2 place-items-center">

                    <div className="flex flex-col  items-center">
                        <button type="button" className="btn btn-circle w-20 h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 btn-accent hover:bg-accent-focus hover:text-white" aria-label="Bouton de création d'intervention" onClick={() => setShowForm(true)}><Icon path={mdiTools} size={2.5} /></button>
                        <p className="text-black font-bold text-center">Créer intervention</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <button type="button" className="btn btn-circle w-20 h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 btn-accent hover:bg-accent-focus hover:text-white" aria-label="bouton de création de matériel" onClick={() => setShowFormMaterial(true)}><Icon path={mdiCog} size={2.5} /></button>
                    <p className="text-black font-bold text-center">Ajouter matériel</p> 
                    </div>

                    <div className="flex flex-col items-center">
                        <button type="button" className="btn btn-circle w-20 h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 btn-accent hover:bg-accent-focus hover:text-white" aria-label="bouton de création de préventif" onClick={() => setShowFormPreventive(true)}><Icon path={mdiCalendarPlus} size={2.5} /></button>
                    <p className="text-black font-bold text-center">Créer préventif</p> 
                    </div>
                    
                    <Link to={`/historique/${serviceLabel}`} aria-label="Lien vers l'historique des interventions">
                        <div className="flex flex-col items-center">
                            <button type="button" className="btn btn-circle w-20 h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 btn-neutral hover:text-white" aria-label="Accéder à l'historique des interventions"><Icon path={mdiHistory} size={2.5} /></button>
                            <p className="text-black font-bold text-center">Historique</p>
                        </div>
                    </Link>

                    {service?.id === 1 && (
                        <>
                        <Link to={`/magasin/consommable/${serviceLabel}`} aria-label="Lien vers la page alerte consommable">
                            <div className="flex flex-col items-center">
                                <button type="button" className="btn btn-circle w-20 h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 btn-error hover:bg-error-focus hover:text-white" aria-label="Accéder à la page alerte consommables"><Icon path={mdiAlert} size={2.5} /></button>
                            <p className="text-black font-bold text-center">Alerte consommable</p> 
                            </div>
                        </Link>
                    
                    <div className="flex flex-col items-center">
                        <Link to={`/magasin/sortie/${serviceLabel}`} aria-label="Lien vers la page sortie de matériel">
                            <button type="button" className="btn btn-circle w-20 h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 btn-warning hover:bg-warning-focus hover:text-white" aria-label="Accéder à la page sortie de matériel"><Icon path={mdiCartVariant} size={2.5} /></button>
                        <p className="text-black font-bold text-center">Sortie matériel</p>
                    </Link> 
                    </div>
                    </>  
                    )}                                  
                </div>
                {/* Fin boutons d'action */}

                {/* Carte d'activité */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4 w-full max-w-7xl ">

                    <Link to={`/demandes/${serviceLabel}`} aria-label="Lien vers la page  demandes d'intervention">
                    <div className="card max-w-96 shadow-sm text-black flex flex-col items-center hover:bg-gray-400 border border-white hover:cursor-pointer hover:shadow-lg transition
                    duration-300 ease-in-out">
                        <figure className="px-10 pt-10">
                        <Icon path={mdiMessageAlert} size={4} className="md:size-6" />
                        </figure>
                        <div className="badge badge-error font-bold w-16 h-16 md:w-20 md:h-20 rounded-full  flex items-center justify-center text-4xl "> {requestedInterventions.length} </div>
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Demandes d'intervention</h2>                        
                        </div>
                    </div>
                    </Link>

                    <Link to={`/encours/${serviceLabel}`} aria-label="Lien vers la page interventions en cours" >
                    <div className="card max-w-96 shadow-sm text-black flex flex-col items-center hover:bg-gray-400 border border-white hover:cursor-pointer hover:shadow-lg transition
                    duration-300 ease-in-out">
                        <figure className="px-10 pt-10">
                            <Icon path={mdiProgressWrench} size={4} className="md:size-6" />
                        </figure>
                        <div className="badge badge-error font-bold w-16 h-16 md:w-20 md:h-20 rounded-full  flex items-center justify-center text-4xl ">{inProgressInterventions.length} </div>
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Interventions en cours</h2>                        
                        </div>
                    </div>
                    </Link>

                    <Link to={`/preventifs/${serviceLabel}`} aria-label="Lien vers la page interventions préventives">
                    <div className="card max-w-96 shadow-sm text-black flex flex-col items-center hover:bg-gray-400 border border-white hover:cursor-pointer hover:shadow-lg transition
                    duration-300 ease-in-out">
                        <figure className="px-10 pt-10">
                        <Icon path={mdiCalendarClock} size={4} className="md:size-6" />
                        </figure>
                        <div className="badge badge-error font-bold w-16 h-16 md:w-20 md:h-20 rounded-full  flex items-center justify-center text-4xl "> {preventivesInterventions.length} </div>
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Interventions préventives</h2>                        
                        </div>
                    </div>
                    </Link>
                    <Link to={`/historique/${serviceLabel}`} aria-label="Lien vers l'historique des interventions">
                    <div className="card max-w-96 shadow-sm text-black flex flex-col items-center hover:bg-gray-400 border border-white hover:cursor-pointer hover:shadow-lg transition
                    duration-300 ease-in-out">
                        <figure className="px-10 pt-10">
                        <Icon path={mdiHistory} size={4} className="md:size-6" />
                        </figure>
                        <div className="badge badge-neutral font-bold w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-4xl text-white">
                            {allInterventions.filter((i) => i.serviceId === service?.id).length}
                        </div>
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Historique</h2>
                        </div>
                    </div>
                    </Link>
                </div>
                {/* Fin cartes d'activité */}

                {/* Formulaire création matériel */}
                <FormMaterialRequest show={showFormMaterial} onClose={() => setShowFormMaterial(false)} />
                    
                {/* Formulaire création intervention */}
                <FormInterventionRequest show={showForm} onClose={() => setShowForm(false)} />
                
                {/* Formulaire création préventif */}
                <FormPreventiveRequest show={showFormPreventive} onClose={() => setShowFormPreventive(false)} />
            </section>
        </main>        
    );
};

export default TestHomePage