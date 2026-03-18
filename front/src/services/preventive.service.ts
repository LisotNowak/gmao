import type { IPreventive, IPreventiveFormData, IUpdatePreventive } from "../types/IPreventive";
import api from "../utils/axios";

const preventiveService = {

    // Créer un préventif avec id dans le body
    async createPreventiveWithoutId(preventive: IPreventiveFormData) {
        const payload = {
            title: preventive.title,
            description: preventive.description,
            date: preventive.date,
            serviceId: preventive.serviceId,
            materialId: preventive.materialId,
            is_recurring: preventive.is_recurring,
            recurrence_days: preventive.is_recurring ? preventive.recurrence_days : null,
        };
        const preventiveResponse = await api.post("/preventives/material", payload)
        return preventiveResponse.data as IPreventive
    },

    //Récupérer toutes les préventifs 
    async getAllPreventives() {
        const preventiveResponse = await api.get("/preventives")
        return preventiveResponse.data as IPreventive[]
    } ,

    // Supprimer un préventif
    async deletePreventive(id:number) {
      const response = await api.delete(`/preventives/${id}`);
      return response.data
    },

    // Modifier un préventif
    async updatePreventive(preventive: IUpdatePreventive) {
      const response = await api.put(`/preventives/${preventive.id}`, preventive); 
      return response.data;
    },

     // Modifier le status d'un préventif
    async updateStatusPreventive(id: number, statusId: number, validationCode: number): Promise<IPreventive> {
      const response = await api.put(`/preventives/status/${id}`, {statusId, validationCode}); 
      return response.data;
    },
};

export default preventiveService