/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <Linter capricieux> */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCreateIntervention } from "../../hooks/useInterventions";
import serviceService from "../../services/services.service";
import userService from "../../services/user.service";
import type { IInterventionFormData } from '../../types/IInterventions';
import type { IService } from "../../types/IService";
import SearchBarLocalisation from "../SearchBars/searchBarLocalisation";
import SearchBarMaterialEmployee from "../SearchBars/searchBarMaterialEmployee";
import SearchBarPriority from '../SearchBars/searchBarPriority';
import SearchBarType from "../SearchBars/searchBarTyp";

type Props = {
  show: boolean;
  onClose: () => void;
};

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
};

export default function FormInterventionRequestEmployee ({ show, onClose }: Props) {
  
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
    }, 1000);
  };

  const [services, setServices] = useState<IService[]>([]);
  const [form, setForm] = useState<IInterventionFormData>({
    title: "",
    description: "",    
    categoryId: null,
    localisationId: null,
    priorityId: null,
    picture: "",   
    requestor_firstname: "",
    requestor_lastname: "",
    serviceId: null,
    materialId: null,
    typeId: null,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAllServices();
        setServices(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services :", error);
      }
    };
    if (show) {
      fetchServices();
    };
  }, [show]);

  const { mutate: createIntervention } = useCreateIntervention(); 

  if (!show) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit =async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("📤 Données envoyées :", { ...form});

  if (!form.serviceId) {
    addToast("Service introuvable !", "error");
    return;
  };

   if (!form.typeId) {
    alert("Le domaine d'intervention est obligatoire !");
    return;
  }

   if (!form.localisationId) {
    alert("La localisation est obligatoire !");
    return;
  }

  try {
    const users = await userService.getAllUsers();
    console.log(users)
   
    createIntervention(
      { ...form, },
      {
        onSuccess: () => {          
          setForm({
            title: "",
            description: "",
            categoryId: null,
            localisationId: form.localisationId,
            priorityId: null,
            picture: "",
            typeId: null,
            serviceId: form.serviceId,
            materialId: null,
            requestor_firstname: "",
            requestor_lastname: "",             
          });
          addToast("Demande d'intervention créée avec succès", "success");
          console.log(form.serviceId)
          setTimeout(() => {
            onClose()
          }, 1000);          
        },        
        onError: (err) => {
          console.error("Erreur création intervention", err);
          addToast("Erreur lors de la création de l'intervention", "error");
        },
      }
    );   
  } catch(error){
    console.error("Erreur lors de la récupération des utilisateurs", error);
    addToast("Erreur lors de la vérification du code.", "error");
  }
};

  return (
        <div className="flex items-center justify-center h-screen min-h-screen px-4" style={{ backgroundColor: '#213547' }}>       
         
          <form
            onSubmit={handleSubmit}
            className="bg-white border text-black p-6 rounded-lg w-full max-w-4xl mx-auto gap-6 shadow-md">
            <div className="">
              <h2 className="mb-1 font-semibold text-2xl text-center">Demander une intervention</h2>
              <hr className="mb-1 border-gray-300" />
            </div>
            <fieldset className="border p-2 rounded flex justify-between gap-4 mb-4 ">
                <legend className="font-bold text-lg  ">Informations demandeur</legend>
                <div className=" w-full flex justify-around gap-5 text-center items-center">
                  <div>
                    <label htmlFor="requestor_lastname" className=" font-medium ">Nom</label>
                    <input
                      id="requestor_lastname"
                      name="requestor_lastname"
                      value={form.requestor_lastname}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                  <label htmlFor="requestor_firstname" className=" font-medium">Prénom</label>
                  <input
                    id="requestor_firstname"
                    name="requestor_firstname"
                    value={form.requestor_firstname}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className="flex gap-2">    
              <label htmlFor="serviceId" className="font-bold">Service concerné</label>
              <select
                  id="serviceId"
                  name="serviceId"
                  required
                  className="focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 mb-4"
                  value={form.serviceId ?? ""}
                  onChange={(e) =>
                  setForm((prev) => ({ ...prev, serviceId: Number(e.target.value) }))}>
                  <option value="">-- Sélectionner un service --</option>
                  {services.map((s) => (
                  <option key={s.id} value={s.id}>
                      {s.label}
                  </option>
                  ))}
              </select>
            </fieldset>

            <div className="grid grid-cols-2 gap-2">
  
  {/* Colonne 2 : Informations principales */}

          <div className="col-span-1 ">
            <div>
              <label htmlFor="title" className=" font-bold">Titre</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full p-1 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
              />
            </div>

              <div>
                <label htmlFor="typeId" className=" font-bold">Domaine d'intervention</label>
                <SearchBarType
                  onSelect={(id) => setForm((prev) => ({ ...prev, typeId: id }))}                   
                /> 
                 {!form.typeId && <span className="text-red-500 text-sm">Ce champ est obligatoire</span>}  
              </div>

              <div>
                <label htmlFor="localisationId" className=" font-bold">Localisation</label>
                <SearchBarLocalisation
                  onSelect={(loc) => {
                      setForm((prev) => ({ ...prev, localisationId: loc.id }));   
                  }}
                /> 
                 {!form.localisationId && <span className="text-red-500 text-sm">Ce champ est obligatoire</span>}     
              </div>          

            <div className="text-black bg-white">
              <label htmlFor="materialId" className=" font-bold">Matériel concerné</label>  
              <SearchBarMaterialEmployee
                onSelect={(id) => setForm((prev) => ({ ...prev, materialId: id }))} 
              />                 
            </div>            
          </div>

          <div className="col-span-1 ">          

            <div>
              <label htmlFor="description" className="  font-bold">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-1 border border-gray-400 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label htmlFor="priorityId" className=" font-bold">Priorité</label>
              <SearchBarPriority
                onSelect={(id) => setForm((prev) => ({ ...prev, priorityId: id })) } 
              />            
            </div>

            {/* <div>
              <label htmlFor="picture" className=" font-medium">Ajouter une photo</label>
              <input
                id="picture"
                name="picture"
                type="file"
                onChange={handleChange}
                className="file-input file-input-neutral w-full"
              />
            </div>

            <div>
              <label htmlFor="wantsToBeContacted" className="block mb-1 font-medium">Me prévenir à la fin</label>
              <input
                type="checkbox"
                id="wantsToBeContacted"
                defaultChecked
                className="toggle toggle-success"
              />
            </div> */}          
          </div>

          {/* Boutons d'action sur la ligne entière */}
          <div className="col-span-3 flex justify-center gap-4 mt-6">
            <button type="button" onClick={onClose} className="btn btn-error hover:text-white">
              Annuler
            </button>
            <button type="submit" className="btn btn-success font-bold hover:text-white">
              Confirmer ma demande
            </button>
          </div>
        </div>
      </form>

      <ToastContainer toasts={toasts} />
    </div>                       
  );
}
