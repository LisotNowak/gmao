/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <linter capricieux> */
import type { NextFunction, Request, Response } from "express";
import { io } from "../app";
import { PrismaClient } from "@prisma/client";
import { createHttpError } from "../utils/httpError";

const prisma = new PrismaClient();

function serializeIntervention(intervention: any) {
  if (!intervention) return intervention;
  const copied = { ...intervention } as any;

  // ensure a mime value is always returned so the frontend can rely on it
  // (some old DB rows may have been created before we tracked the type)
  if (!copied.mimetype) {
    // if there's a picture we guess png, otherwise leave null
    copied.mimetype = copied.picture ? 'image/png' : null;
  }

  try {
    const pic = copied.picture;
    const mime = copied.mimetype || 'image/png';
    if (!pic) return copied;

    // some database rows end up with an *empty object* ({}), typically because
    // the binary column contained a zero‑length buffer.  Express/JSONify will
    // happily send that object to the client, where it becomes `{}' and
    // breaks the image handling logic.  treat it as meaning “no picture”.
    if (typeof pic === 'object' && Object.keys(pic).length === 0) {
      copied.picture = null;
      copied.mimetype = null; // clear stale mime type when there is no data
      return copied;
    }

    // debug unexpected structures – we'll convert them or null them later
    if (typeof pic === 'object' && !Buffer.isBuffer(pic) && !(Array.isArray((pic as any).data))) {
      console.log('[serializeIntervention] unexpected picture shape', pic);
    }

    // Buffer (Node) -> base64
    if (Buffer.isBuffer(pic)) {
      const str = `data:${mime};base64,${pic.toString('base64')}`;
      console.log(`[serializeIntervention] converted buffer, len=${str.length}`);
      copied.picture = str;
      return copied;
    }

    // Prisma/JSON serialized buffer -> { type: 'Buffer', data: [...] }
    if (typeof pic === 'object' && pic.data) {
      let arr: number[] | undefined;
      if (Array.isArray((pic as any).data)) {
        arr = (pic as any).data;
      } else if (typeof (pic as any).data === 'object') {
        arr = Object.values((pic as any).data) as number[];
      }
      if (arr) {
        const buf = Buffer.from(arr);
        // if the buffer has no bytes treat as absent
        if (buf.length === 0) {
          copied.picture = null;
          copied.mimetype = null;
          return copied;
        }
        const str = `data:${mime};base64,${buf.toString('base64')}`;
        console.log(`[serializeIntervention] converted json-array buffer, len=${str.length}`);
        copied.picture = str;
        return copied;
      }
    }
    // handle case where pic is an object whose keys are numeric indices (JSONified Buffer)
    if (typeof pic === 'object' && !Buffer.isBuffer(pic) && !Array.isArray(pic)) {
      const keys = Object.keys(pic);
      if (keys.length > 0 && keys.every((k) => /^\d+$/.test(k))) {
        const arr = keys.map((k) => Number((pic as any)[k]));
        const buf = Buffer.from(arr);
        if (buf.length === 0) {
          copied.picture = null;
          copied.mimetype = null;
          return copied;
        }
        const str = `data:${mime};base64,${buf.toString('base64')}`;
        console.log(`[serializeIntervention] converted numeric-keyed buffer, len=${str.length}`);
        copied.picture = str;
        return copied;
      }
    }

    // If it's already a string but not a data: URI, assume base64
    if (typeof pic === 'string') {
      // if the string looks like an object ({}) or is clearly not valid
      // base64 we drop it.
      if (pic === '{}' || pic.trim() === '') {
        console.log('[serializeIntervention] dropping empty string picture');
        copied.picture = null;
        copied.mimetype = null;
        return copied;
      }
      if (pic.startsWith('data:')) {
        console.log('[serializeIntervention] picture already data URI, len=', pic.length);
        copied.picture = pic;
      } else {
        const str = `data:${mime};base64,${pic}`;
        console.log('[serializeIntervention] built data URI from string, len=', str.length);
        copied.picture = str;
      }
      return copied;
    }
  } catch (err) {
    console.warn('Erreur sérialisation image intervention', err);
  }

  // if we ended up here without converting picture to a string, null it so
  // the client never sees an unusable value (prevents broken-img icons).
  if (copied.picture && typeof copied.picture !== 'string') {
    copied.picture = null;
  }
  return copied;
}

// Servir la photo d'une intervention en binaire
export const getInterventionPicture = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "ID invalide" });

  try {
    const intervention = await prisma.intervention.findUnique({
      where: { id },
      select: { picture: true, mimetype: true },
    });

    if (!intervention?.picture) {
      return res.status(404).json({ message: "Pas de photo pour cette intervention" });
    }

    const contentType = intervention.mimetype || "image/png";
    const rawBuffer = intervention.picture as Buffer;

    // Ancien bug : Joi.binary() stockait les octets ASCII du base64 (pas le binaire décodé).
    // On détecte le cas : PNG commence par 0x89, JPEG par 0xFF.
    // Si le premier octet est un caractère ASCII imprimable, c'est du base64 texte → décoder.
    const isProbablyBinary = rawBuffer[0] === 0x89 || rawBuffer[0] === 0xFF || rawBuffer[0] === 0x47;
    const imageBuffer = isProbablyBinary
      ? rawBuffer
      : Buffer.from(rawBuffer.toString("ascii"), "base64");

    res.set("Content-Type", contentType);
    res.set("Cache-Control", "public, max-age=86400");
    res.send(imageBuffer);
  } catch (error) {
    next(error);
  }
};

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
      picture: pictureBase64,
      mimetype,
      ...rest
    } = req.body;
    
    

    // Récupération des valeurs du body et des params
    const materialIdFromParams = Number(req.params.id);
    
    const materialId =
      materialIdFromParams > 0
        ? materialIdFromParams
        : Number(materialIdFromBody);

    // Création de l'intervention
    const dataToCreate: any = {
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
    };

    // Si le front envoie une image en base64, convertir en Buffer pour Prisma
    if (pictureBase64) {
      try {
        dataToCreate.picture = Buffer.from(pictureBase64, "base64");
        dataToCreate.mimetype = mimetype || null;
      } catch (err) {
        console.warn("Impossible de décoder l'image base64", err);
      }
    }

    const newIntervention = await prisma.intervention.create({
      data: dataToCreate,
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
    const serialized = serializeIntervention(newIntervention);
    io.emit("new_intervention", serialized);
    res.status(201).json({ material: serialized });
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

    // Si le front envoie une image en base64 dans les champs, la convertir en Buffer
    if ((restFields as any).picture !== undefined) {
      const pic = (restFields as any).picture;
      const mime = (restFields as any).mimetype;
      if (pic === null) {
        data.picture = null;
        data.mimetype = null;
      } else if (typeof pic === "string" && pic.length > 0) {
        try {
          data.picture = Buffer.from(pic, "base64");
          data.mimetype = mime || null;
        } catch (err) {
          console.warn("Impossible de décoder l'image base64 lors de la mise à jour", err);
        }
      }
    }

    // Mettre à jour l'intervention
    const interventionToUpdate = await prisma.intervention.update({
      where: { id },
      data,
    });
     const serializedUpdate = serializeIntervention(interventionToUpdate);
    io.emit("update_intervention", serializedUpdate);
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
    
    const serialized = interventions.map(serializeIntervention);
    console.log("[server] getAllInterventions serialized sample", serialized.slice(0,3).map((i: any)=>({id:i.id, picture:i.picture? (typeof i.picture==='string'?i.picture.substring(0,30):'[obj]'):null, mimetype:i.mimetype})));
    res.status(200).json(serialized);
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
        const serialized = interventions.map(serializeIntervention);
        console.log("[server] atelier interventions sample", serialized.slice(0,3).map((i: any)=>({id:i.id,picture:i.picture?typeof i.picture==='string'?i.picture.substring(0,30):'[obj]':null})));
        res.status(200).json(serialized);
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
        const serialized = interventions.map(serializeIntervention);
        console.log("[server] SG interventions sample", serialized.slice(0,3).map((i: any)=>({id:i.id,picture:i.picture?typeof i.picture==='string'?i.picture.substring(0,30):'[obj]':null})));
        res.status(200).json(serialized);
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
        res.status(200).json(serializeIntervention(interventionById));
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

    const serialized = interventionsLinked.map(serializeIntervention);

    res.status(200).json(serialized);
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
    const serialized = interventions.map(serializeIntervention);
    res.status(200).json(serialized);
  } catch (error) {
    next(error)
  }
};