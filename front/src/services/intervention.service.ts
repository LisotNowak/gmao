import type { IIntervention, IInterventionFormData, IInterventionHistory } from "../types/IInterventions";
import api from '../utils/axios';

const interventionService = {
    // Créer une intervention avec id dans le body
    async createInterventionWithoutId(intervention: IInterventionFormData) {   
    const interventionResponse = await api.post("/interventions/material", intervention)
    return interventionResponse.data as IIntervention
    },

    // Créer une intervention avec id dans l'url
   async createInterventionWithId(id: number, intervention: IInterventionFormData) {
    const interventionResponse = await api.post(`/interventions/material/${id}`, intervention)
    return interventionResponse.data as IIntervention
    },

    //Récupérer toutes les interventions 
    async getAllInterventions() {
        const interventionResponse = await api.get("/interventions")
        return interventionResponse.data as IIntervention[]
    } ,

    //Récupérer toutes les interventions de l'atelier
    async getAllInterventionsAtelier() {
        const interventionResponse = await api.get("/interventions/atelier")
        return interventionResponse.data as IIntervention[]
    } ,

    //Récupérer toutes les interventions des Services Généraux
    async getAllInterventionsSG() {
        const interventionResponse = await api.get("/interventions/sg")
        return interventionResponse.data as IIntervention[]
    } ,

    // Récupérer les interventions par status
    async getInterventionsByStatus(statusId: number) : Promise<IIntervention[]> {
        const interventionResponse = await api.get(`/interventions/status/${statusId}`)
        return interventionResponse.data as IIntervention[]
    },

    // Récupérer les interventions liées à un matériel
    async getInterventionsByMaterial(materialId: number): Promise<IInterventionHistory[]> {
        const response = await api.get(`/interventions/material/${materialId}`);
        return response.data as IInterventionHistory[];
    },

    // Modifier le status d'une intervention
    async updateInterventionStatus(id: number, statusId: number, validationCode: number): Promise<IIntervention> {
        const response = await api.patch(`/interventions/${id}/status`, { statusId,validationCode });
        return response.data as IIntervention;
    },

    // Supprimer une intervention
    async deleteIntervention (id: number) {
        const response = await api.delete(`/interventions/${id}`);
        return response.data as IIntervention;
    },

    // Ajouter un commentaire final    
    async finalizationIntervention (id: number, final_comment: string, validation_code: number) {
        const response = await api.patch(`/interventions/${id}`, { final_comment, statusId: 3,validation_code });
        return response.data as IIntervention;
    },

    // Mettre à jour une intervention (nécessite code de validation)
    async updateIntervention(
        id: number,
        data: Partial<IInterventionFormData>,
        validation_code: number
    ): Promise<IIntervention> {
        const response = await api.patch(`/interventions/${id}`, { ...data, validation_code });
        return response.data as IIntervention;
    }
};

export default interventionService;