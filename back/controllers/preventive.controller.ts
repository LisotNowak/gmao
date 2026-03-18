/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <linter capricieux> */
import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createHttpError } from "../utils/httpError";

const prisma = new PrismaClient();

// Créer un entretien préventif
export const createPreventive = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    try {
         // Récupérer materialId dans l'URL ou dans le body
        const materialIdFromParams = Number(req.params.id);

        const { materialId: materialIdFromBody, serviceId, ...rest } = req.body;

         // Priorité au paramètre URL s'il est valide (>0)
        const materialId = materialIdFromParams > 0 ? materialIdFromParams : materialIdFromBody;

         if (!materialId) {
            return res.status(400).json({ error: 'Material ID manquant' });
        };

       const newPreventive = await prisma.preventive.create({
        data: {
            ...rest,
            ...(serviceId && { service: { connect: { id: serviceId } } }),
            ...(materialId && {
            materialLinks: {
                create: [{ material: { connect: { id: materialId } } }],
            },
            }),
        },
        });

        const linkedMaterial = await prisma.material.findUnique({
            where: { id: materialId },
            include: {
                category: true,
                localisation: true,
                service: true,
                type: true,
                status: true,
                parentGroup: true,
                parent: true,
            },
        });
        
        res.status(201).json({
            preventive: newPreventive,
            material: linkedMaterial
        });
    } catch (error) {
        next(error)
    }
};

/// Modifier un entretien préventif
export const updatePreventive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    // Vérifie que le préventif existe
    const preventiveSelected = await prisma.preventive.findUnique({ where: { id } });

    if (!preventiveSelected) {
      throw createHttpError(404, `Entretien préventif non trouvé`);
    }

    // Supprime l'id du body pour éviter les conflits
    const { id: _, ...updateData } = req.body;

    const preventiveToUpdate = await prisma.preventive.update({
      where: { id },
      data: {
        ...updateData,
        updated_at: new Date(),
      },
    });
    
    res.status(200).json({
      message: `${preventiveToUpdate.title} mis à jour avec succès`,
      preventive: preventiveToUpdate,
    });
  } catch (error) {
    next(error);
     console.error('Erreur lors de la mise à jour:', error);
    
  }
};

/// Modifier le satus un entretien préventif
export const updateStatusPreventive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    
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

  if (validationCode == null || typeof validationCode !== "number") {
    return res.status(400).json({ message: "Code de validation requis." });
  };

  try {
    // Vérifier qu’un utilisateur possède ce code de validation
    const user = await prisma.user.findFirst({
      where: { validation_code: validationCode },
    });

    if (!user) {
      return res.status(403).json({ message: "Code de validation incorrect." });
    }

    // Vérifie que le préventif existe
    const preventiveSelected = await prisma.preventive.findUnique({ where: { id } });

    if (!preventiveSelected) {
      throw createHttpError(404, `Entretien préventif non trouvé`);
    }

    // Supprime l'id du body pour éviter les conflits
    const { id:  _, statusId, validationCode: _validationCode, ...updateData } = req.body;

    const preventiveToUpdate = await prisma.preventive.update({
       where: { id },
      data: {
        ...updateData, // ici je ne passe pas statusId ni validation_code
        status: {
          connect: { id: statusId },  // mise à jour via la relation
        },
        updated_at: new Date(),
      },
      include: {
        materialLinks: true,
      },
    });

    // Si clôture (statusId=3) et préventif récurrent → créer le suivant
    if (statusId === 3 && preventiveSelected.is_recurring && preventiveSelected.recurrence_days) {
      const closingDate = new Date();
      const nextDate = new Date(closingDate);
      nextDate.setDate(nextDate.getDate() + preventiveSelected.recurrence_days);

      const newPreventive = await prisma.preventive.create({
        data: {
          title: preventiveSelected.title,
          description: preventiveSelected.description,
          process: preventiveSelected.process,
          date: nextDate,
          serviceId: preventiveSelected.serviceId,
          is_recurring: true,
          recurrence_days: preventiveSelected.recurrence_days,
          statusId: 1,
        },
      });

      // Recréer les liens matériels
      const materialLinks = (preventiveToUpdate as any).materialLinks as { materialId: number }[];
      for (const link of materialLinks) {
        await prisma.materialPreventive.create({
          data: {
            preventiveId: newPreventive.id,
            materialId: link.materialId,
          },
        });
      }
    }

    res.status(200).json({
      message: `${preventiveToUpdate.title} mis à jour avec succès`,
      preventive: preventiveToUpdate,
    });
  } catch (error) {
    next(error);
     console.error('Erreur lors de la mise à jour:', error);    
  }
};


// Suppirmer un entretien préventif
export const deletePreventive = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {    
    // Je récupère l'id du préventif à supprimer
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }   
   
    // Je supprime le préventif
    try {
         // Je récupère le préventif en bdd
        const preventiveSelected = await prisma.preventive.findUnique({
            where: {id}            
        });  

         // Si pas de préventif en bdd, j'envoie une erreur
        if (!preventiveSelected) {
        throw createHttpError(404, `Entretien préventif non trouvé`);
        };

        // Supprimer les dépendances avant
        await prisma.materialPreventive.deleteMany({ where: { preventiveId: id } });

        const preventiveToDelete = await prisma.preventive.delete({
            where: {id}
        });
         res.status(200).json({ message: `${preventiveToDelete.title} supprimé avec succès` });
    } catch (error) {
        next(error)
    }
};

// Récupérer tous les entretiens préventifs du service Atelier
export const getAllPreventivesAtelier = async ( 
    req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
        const preventives = await prisma.preventive.findMany({
            where: {serviceId: 1},
            orderBy: {
                created_at: "asc",
            }
        });
        res.status(200).json(preventives);
    } catch (error) {
       next(error); 
    }
};

// Récupérer tous les entretiens préventifs 
export const getAllPreventives = async ( 
    req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
        const preventives = await prisma.preventive.findMany({           
            orderBy: {
                created_at: "asc",
            },
            include:{
                materialLinks: {
                    include: {
                        material: true
                    }
                },
                users: {
                  include: {
                    user:true
                  }
                }              
            }
        });
        res.status(200).json(preventives);
    } catch (error) {
       next(error); 
    }
};

// Récupérer tous les entretiens préventifs du service Services Généraux
export const getAllPreventivesSg = async ( 
    req: Request,   
    res: Response,
    next: NextFunction
) => {
    try {
        const preventives = await prisma.preventive.findMany({
            where: {serviceId: 2},
            orderBy: {
                created_at: "asc",
            }
        });
        res.status(200).json(preventives);
    } catch (error) {
       next(error); 
    }
};

// Récupérer un entretien préventif par son id
export const getPreventiveById= async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Je récupère l'id du préventif sélectionné
    const  preventiveId  = Number(req.params.id);

    if (Number.isNaN(preventiveId)) {
    return res.status(400).json({ message: "ID invalide" });
  };
    // Je vais rechercher en bdd le préventif sélectionné
    try {
        const preventiveById = await prisma.preventive.findUnique({
            where: {id: preventiveId}
        })
        res.status(200).json(preventiveById);
    } catch (error) {
        next(error); 
    }
};

// Récupérer les entretiens préventifs par matériel
export const getPreventivesByMaterial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const materialId = Number(req.params.materialId);    

  // Je vérifie que l'id corresponde à quelque chose
  if (Number.isNaN(materialId)) {
    return res.status(400).json({ message: "ID de statut invalide" });
  };
 
  try {
     // Vérifie si le préventif existe en bdd
    const materialExists = await prisma.material.findUnique({ where: { id: materialId } });

    if (!materialExists) {
      return res.status(404).json({ message: "Matériel non trouvé" });
    }

    // Récupère toutes les préventifs lié à un matériel
    const materialPreventives = await prisma.materialPreventive.findMany({
      where: { materialId},
       include: {
       preventive: {
          include: {
            service: true,              
          },
        },
        }       
    });
    const preventives = materialPreventives.map((link: { preventive: any; }) => link.preventive);
    res.status(200).json(preventives);
  } catch (error) {
    next(error)
  }
};