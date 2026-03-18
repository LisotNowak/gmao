import type { IMaterial } from "./Imaterial";

export type IPreventive = {
    id: number,
    title : string,
    description: string,
    process: string,
    date: Date;
    serviceId: number | null
    materialLinks: {
        materialId: number;
        preventiveId: number;
        material: IMaterial;
    }[];
    users: {
        user: {
            firstname: string;
            lastname: string;
        };
    }[];
    statusId: number,
    is_recurring: boolean,
    recurrence_days: number | null,
    created_at: string
    updated_at: string
};

export type IUpdatePreventive = {
    id: number,
    title? : string,
    description?: string,
    process?: string,    
    date?: Date;    
    materialLinks?: {
        materialId: number;
        preventiveId: number;
        material: IMaterial;
    }[];    
};

export type IUpdateStatusPreventive = {
    id: number,
    title? : string,
    description?: string,
    process?: string,    
    date?: Date;    
    materialLinks?: {
        materialId: number;
        preventiveId: number;
        material: IMaterial;
    }[];
    statusId: number,        
};

export type IPreventiveFormData = {
    title : string,
    description: string,
    date: Date | null;
    serviceId: number | null
    materialId: number | null,
    is_recurring: boolean,
    recurrence_days: number | null,
};