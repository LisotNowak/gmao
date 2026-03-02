

export type IIntervention = {  
  id: number
  title: string | null
  description: string | null
  detail: string | null
  initial_comment: string | null
  final_comment: string | null
  begin_date: string // ou Date 
  picture: string | null
  mimetype: string | null
  serviceId: number,
  localisation: {
    id: number,
    label: string
  },
  statusId: number | null
  category: {
    id: number,
    label: string
  }
  priorityId: number | null
  type?: {
    id: number,
    label: string
  } | null
  requestor_firstname: string,
  requestor_lastname: string ,
  materials: {
    id: number;
    materialId: number;
    interventionId: number;
    material?: {
      id: number;
      name: string;
    };
  }[];
  created_at: string 
  updated_at: string 
}

export type IInterventionFormData = {
    title : string,
    description: string,    
    categoryId: number | null,  
    typeId:number | null,  
    localisationId: number | null, 
    priorityId: number | null,     
    picture: string, 
    serviceId: number | null, 
    materialId: number | null, 
    requestor_firstname: string,
    requestor_lastname: string    
}

export type IInterventionHistory = {   
  id: number
  title: string | null
  description: string | null
  detail?: string | null
  initial_comment: string | null
  final_comment: string | null
  begin_date: string 
  picture: string | null
  mimetype: string | null
  service?: {
    id: number
    label: string
  } | null
  localisation?: {
    id: number
    label: string
  } | null
  status?: {
    id: number
    label: string
  } | null
  category?: {
    id: number
    label: string
  } | null
  priority?: {
    id: number
    label: string
  } | null
  type?: {
    id: number
    label: string
  } | null
  requestor_firstname: string | null
  requestor_lastname: string | null
  created_at: string 
  updated_at: string 
}