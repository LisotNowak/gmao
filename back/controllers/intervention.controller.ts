/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <linter capricieux> */
import type { NextFunction, Request, Response } from "express";
import { io } from "../app";
import { PrismaClient } from "@prisma/client";
import { createHttpError } from "../utils/httpError";

const prisma = new PrismaClient();

// Créer une intervention
export const createIntervention = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
     const {
      materialId: materialIdFromBody,
      serviceId,
      localisationId,
      categoryId,
      priorityId,
      typeId,      
      ...rest
    } = req.body;
    
    

    // Récupération des valeurs du body et des params
    const materialIdFromParams = Number(req.params.id);
    
    const materialId =
      materialIdFromParams > 0
        ? materialIdFromParams
        : Number(materialIdFromBody);

    // Création de l'intervention
    const newIntervention = await prisma.intervention.create({
      data: {
        ...rest,
        service: serviceId
          ? { connect: { id: Number(serviceId) } }
          : undefined,
        localisation: localisationId
          ? { connect: { id: Number(localisationId) } }
          : undefined,
        status: { connect: { id: 1 } },
        category: categoryId
          ? { connect: { id: Number(categoryId) } }
          : undefined,
        priority: priorityId
          ? { connect: { id: Number(priorityId) } }
          : undefined,
        type: typeId ? { connect: { id: Number(typeId) } } : undefined,       

        materials: materialId
          ? {
              create: [
                {
                  material: {
                    connect: { id: materialId },
                  },
                },
              ],
            }
          : undefined,
      },
      include: {
        materials: {
          include: {
            material: true,
          }
        },       
        category: true,
        type: true,
        service: true,
        localisation: true,
        priority: true,
        status: true,
      },
    });

    // Création du statut historique lié
    await prisma.statusIntervention.create({
      data: {
        statusId: 1,
        interventionId: newIntervention.id,
      },
    });
    io.emit("new_intervention", newIntervention);
    res.status(201).json({ material: newIntervention });
  } catch (error) {
    next(error);
  }  
};

// Modifier une intervention
export const updateIntervention = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupérer l'id de l'intervention sélectionnée
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    // Vérifier que l'intervention existe en BDD
    const interventionSelected = await prisma.intervention.findUnique({
      where: { id },
    });

    if (!interventionSelected) {
      throw createHttpError(404, "Intervention non trouvée");
    }

    // Extraire validation_code, statusId, status et autres données du corps de la requête
    const { validation_code, statusId, status, ...otherData } = req.body;

    // Vérifier que le validation_code correspond à un utilisateur existant
    if (!validation_code) {
      return res.status(400).json({ message: "Le code de validation est requis" });
    }

    const userWithCode = await prisma.user.findFirst({
      where: { validation_code: validation_code },
    });

    if (!userWithCode) {
      return res.status(400).json({ message: "Code de validation invalide" });
    }

    // Désémantique les identifiants de relation envoyés par le front
    const {
      categoryId,
      localisationId,
      priorityId,
      typeId,
      serviceId,
      materialId,
      ...restFields
    } = otherData as any;

    // Construire les données à mettre à jour
    // biome-ignore lint/suspicious/noExplicitAny: <Linter capricieux>
    const data: any = {
      ...restFields,
      updated_at: new Date(),
    };

    // Gérer les mises à jour des relations en fonction des ids
    if (categoryId !== undefined) {
      data.category = categoryId
        ? { connect: { id: Number(categoryId) } }
        : { disconnect: true };
    }
    if (localisationId !== undefined) {
      data.localisation = localisationId
        ? { connect: { id: Number(localisationId) } }
        : { disconnect: true };
    }
    if (priorityId !== undefined) {
      data.priority = priorityId
        ? { connect: { id: Number(priorityId) } }
        : { disconnect: true };
    }
    if (typeId !== undefined) {
      data.type = typeId
        ? { connect: { id: Number(typeId) } }
        : { disconnect: true };
    }
    if (serviceId !== undefined) {
      data.service = serviceId
        ? { connect: { id: Number(serviceId) } }
        : { disconnect: true };
    }

    // gérer associations matériel si l'id est présent
    if (materialId !== undefined) {
      // on supprime les anciens liens et on ajoute le nouveau (ou aucun si null)
      data.materials = materialId
        ? {
            deleteMany: {},
            create: [{ material: { connect: { id: Number(materialId) } } }],
          }
        : { deleteMany: {} };
    }

    // Gérer la mise à jour de la relation status si présente
    if (statusId !== undefined) {
      data.status = { connect: { id: Number(statusId) } };
    } else if (status !== undefined) {
      data.status = { connect: { id: Number(status) } };
    }

    // Mettre à jour l'intervention
    const interventionToUpdate = await prisma.intervention.update({
      where: { id },
      data,
    });
     io.emit("update_intervention", interventionToUpdate);
    res.status(200).json({ message: `${interventionToUpdate.title} mis à jour avec succès` });
  } catch (error) {
    next(error);
  }
};

// Modifier le status d'une intervention
export const updateInterventionStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Je récupère l'id de l'intervention selectionnée
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID invalide" });
    };

    // Je récupère le status de l'intervention
    const { statusId , validationCode} = req.body;

    // Vérification du champ statusId
    if (!statusId || typeof statusId !== "number") {
      return res.status(400).json({ message: "ID de statut manquant ou invalide" });
    };

    if (!validationCode || typeof validationCode !== "number") {
      return res.status(400).json({ message: "Code de validation requis." });
    }

    try {
        // Vérifier qu’un utilisateur possède ce code de validation
        const user = await prisma.user.findFirst({
          where: { validation_code: validationCode },
        });

        if (!user) {
          return res.status(403).json({ message: "Code de validation incorrect." });
        }

        // Je récupère l'intervention' en bdd si elle existe
        const interventionSelected = await prisma.intervention.findUnique({
            where: {id}            
        });

        // Si l'id ne correspond à rien en bdd, j'envoie une erreur
        if (!interventionSelected) {
        throw createHttpError(404, `Intervention non trouvée`);
        } 

        // Associer l'utilisateur à l'intervention (si ce n’est pas déjà fait)
        const alreadyAssigned = await prisma.userIntervention.findFirst({
          where: {
            userId: user.id,
            interventionId: id,
          },
        });

        if (!alreadyAssigned) {
          await prisma.userIntervention.create({
            data: {
              userId: user.id,
              interventionId: id,
            },
          });
        }

        // Je met à jour le status en bdd
        const updateStatus = await prisma.intervention.update({
            where: { id },
            data: {
                statusId,
                updated_at: new Date(),
            },
        });
         io.emit("update_status_intervention", updateStatus);
         res.status(200).json({ message: `${updateStatus.title} mis à jour avec succès` });
    } catch (error) {
        next(error)
    }

};

// Suppirmer une intervention
export const deleteIntervention = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    // Je récupère l'id de l'intervention à supprimer
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID invalide" });
     }   
   
    // Je supprime l'intervention
    try {
         // Je récupère l'intervention en bdd
        const interventionSelected = await prisma.intervention.findUnique({
            where: {id}            
        });  
     
         // Si pas d'intervention' en bdd, j'envoie une erreur
        if (!interventionSelected) {
        throw createHttpError(404, `Interventionl non trouvée`);
        }

        // Je supprime les dépendances avant 
        await prisma.userIntervention.deleteMany({ where: { interventionId: id } });
        await prisma.materialIntervention.deleteMany({ where: { interventionId: id } });
        await prisma.statusIntervention.deleteMany({ where: { interventionId: id } });

        const interventionToDelete = await prisma.intervention.delete({
            where: {id}
        });
         io.emit("delete_intervention", interventionToDelete);
         res.status(200).json({ message: `${interventionToDelete.title} supprimé avec succès` });
    } catch (error) {
        next(error)
    }
};

// Récupérer toutes les interventions
export const getAllInterventions = async (
  req: Request,   
  res: Response,
  next: NextFunction
) => {
  try {
    const interventions = await prisma.intervention.findMany({
      include: {
        materials:{
          include: {
            material: true
          }
        },
        priority:true,
        category: true,
        type: true,
        service: true,
        localisation: true,        
        status: true,
      }
    });
    
    res.status(200).json(interventions);
  } catch (error) {
    next(error);
  }
}

// Récupérer toutes les interventions du service Atelier
export const getAllInterventionsAtelier = async ( 
    req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
    
        const interventions = await prisma.intervention.findMany({
            where: {serviceId: 1},
            include: {
              materials: {
                include: {
                  material: true
                }
              }
            },
            orderBy: {
                created_at: "asc",
            }
        });
        res.status(200).json(interventions);
    } catch (error) {
       next(error); 
    }
};

// Récupérer toutes les interventions du service Service Généraux
export const getAllInterventionsSg = async ( 
    req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
        const interventions = await prisma.intervention.findMany({
            where: {serviceId: 2},
        });
        res.status(200).json(interventions);
    } catch (error) {
       next(error); 
    }
};

// Récupérer toutes les interventions d'une catégorie
export const getInterventionByCategory = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const categoryId =  Number(req.params.categoryId);
    try {
         if (Number.isNaN(categoryId)) {
            return res.status(400).json({ message: "ID de catégorie invalide" });
    }
        const interventionByCategory = await prisma.intervention.findMany({
            where:{categoryId:categoryId }
        })
         res.status(200).json(interventionByCategory);
    } catch (error) {
       next(error); 
    }
};

// Récupérer une intervention par son id
export const getInterventionById= async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Je récupère l'id de l'intervention sélectionnée
    const  interventionId  = Number(req.params.id);

    if (Number.isNaN(interventionId)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    // Je vais rechercher en bdd l'intervention'sélectionnée
    try {
        const interventionById = await prisma.intervention.findUnique({
            where: {id: interventionId}
        })
        res.status(200).json(interventionById);
    } catch (error) {
        next(error); 
    }
};

// Récupérer les interventions par status
export const getInterventionsByStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  const statusId = Number(req.params.statusId);    

  // Je vérifie que l'id corresponde à quelque chose
  if (Number.isNaN(statusId)) {
    return res.status(400).json({ message: "ID de statut invalide" });
  };

  try {
     // Vérifie si le statut existe en bdd
    const statusExists = await prisma.status.findUnique({ where: { id: statusId } });

    if (!statusExists) {
      return res.status(404).json({ message: "Statut non trouvé" });
    }

    // Récupère toutes les interventions du service avec ce statut
    const interventions = await prisma.statusIntervention.findMany({
      where: { statusId},
       include: {
        intervention: {
          include: {
            service: true,
            category: true,
            priority: true,
            type: true,
            localisation: true,
            materials:{
              include:{
                material: true
              }
            }            
          }
        }
      }
    });

    // Extraire uniquement les interventions des liens
    const interventionsLinked = interventions.map((si: { intervention: any; }) => si.intervention);

    res.status(200).json(interventionsLinked);
  } catch (error) {
    next(error)
  }
};

// Récupérer les interventions par matériel
export const getInterventionsByMaterial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const materialId = Number(req.params.materialId);    

  // Je vérifie que l'id corresponde à quelque chose
  if (Number.isNaN(materialId)) {
    return res.status(400).json({ message: "ID de matériel invalide" });
  };
 
  try {
     // Vérifie si le matériel existe en bdd
    const materialExists = await prisma.material.findUnique({ where: { id: materialId } });

    if (!materialExists) {
      return res.status(404).json({ message: "Matériel non trouvé" });
    }

    // Récupère toutes les interventions lié à un matériel
    const materialInterventions = await prisma.materialIntervention.findMany({
      where: { materialId},
       include: {
        intervention: {
          include: {
            service: true,
            status: true,
            type: true,
            priority: true,
            category: true,
          },
        },
        }       
    });
    const interventions = materialInterventions.map((link: { intervention: any; }) => link.intervention);
    res.status(200).json(interventions);
  } catch (error) {
    next(error)
  }
};