import { Router } from "express";
import { createIntervention, deleteIntervention, getAllInterventions, getAllInterventionsAtelier, getAllInterventionsSg, getInterventionByCategory, getInterventionById, getInterventionPicture, getInterventionsByMaterial, getInterventionsByStatus, updateIntervention, updateInterventionStatus } from "../controllers/intervention.controller";
import errorHandler from "../middlewares/errorHandler";
import { validate } from '../middlewares/validate';
import { interventionSchema } from "../validators/intervention.validator";

const interventionRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Interventions
 *   description: API pour gérer les interventions
 */

/**
 * @swagger
 * /api/interventions/material:
 *   post:
 *     summary: Créer une intervention pour un matériel (ID dans le body)
 *     tags: [Interventions]  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Intervention'
 *     responses:
 *       201:
 *         description: Intervention créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Intervention'
 *       400:
 *         description: Données invalides
 */
interventionRouter.post('/material', validate(interventionSchema), createIntervention, errorHandler );

/**
 * @swagger
 * /api/interventions/material/{id}:
 *   post:
 *     summary: Créer une intervention pour un matériel avec l'id dans l'url
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du matériel
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Intervention'
 *     responses:
 *       201:
 *         description: Intervention créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Intervention'
 *       400:
 *         description: Données invalides
 */
interventionRouter.post('/material/:id', validate(interventionSchema), createIntervention, errorHandler );

/**
 * @swagger
 * /api/interventions/atelier:
 *   get:
 *     summary: Récupérer les interventions du service Atelier
 *     tags: [Interventions]
 *     responses:
 *       200:
 *         description: Liste des interventions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Intervention'
 */
interventionRouter.get('/atelier', getAllInterventionsAtelier, errorHandler );

/**
 * @swagger
 * /api/interventions/sg:
 *   get:
 *     summary: Récupérer les interventions des Services Généraux
 *     tags: [Interventions]
 *     responses:
 *       200:
 *         description: Liste des interventions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Intervention'
 */
interventionRouter.get('/services-generaux', getAllInterventionsSg, errorHandler );

/**
 * @swagger
 * /api/interventions/category/{categoryId}:
 *   get:
 *     summary: Récupérer les interventions par catégorie
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Liste des interventions de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Intervention'
 */
interventionRouter.get('/category/:categoryId', getInterventionByCategory, errorHandler);

/**
 * @swagger
 * /api/interventions/status/{statusId}:
 *   get:
 *     summary: Récupérer les interventions par statut
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: statusId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du statut
 *     responses:
 *       200:
 *         description: Liste des interventions avec ce statut
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Intervention'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Statut non trouvé
 */
interventionRouter.get('/status/:statusId', getInterventionsByStatus, errorHandler);

/**
 * @swagger
 * /api/interventions/material/{materialId}:
 *   get:
 *     summary: Récupérer les interventions liées à un matériel
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du matériel
 *     responses:
 *       200:
 *         description: Liste des interventions du matériel
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Intervention'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Matériel non trouvé
 */
interventionRouter.get('/material/:materialId', getInterventionsByMaterial, errorHandler);

/**
 * @swagger
 * /api/interventions/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une intervention
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'intervention
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusId:
 *                 type: integer
 *               validationCode:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       400:
 *         description: ID ou statut invalide
 *       404:
 *         description: Intervention non trouvée
 */
interventionRouter.patch('/:id/status', updateInterventionStatus, errorHandler);

/**
 * @swagger
 * /api/interventions/{id}:
 *   put:
 *     summary: Mettre à jour une intervention
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'intervention
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Intervention'
 *     responses:
 *       200:
 *         description: Intervention mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Intervention non trouvée
 */
interventionRouter.patch('/:id', validate(interventionSchema), updateIntervention, errorHandler );

/**
 * @swagger
 * /api/interventions/{id}:
 *   get:
 *     summary: Récupérer une intervention par ID
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'intervention
 *     responses:
 *       200:
 *         description: Détails de l'intervention
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Intervention'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Intervention non trouvée
 */
interventionRouter.get('/:id/picture', getInterventionPicture, errorHandler);
interventionRouter.get('/:id', getInterventionById, errorHandler );

/**
 * @swagger
 * /api/interventions/{id}:
 *   delete:
 *     summary: Supprimer une intervention
 *     tags: [Interventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'intervention
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Intervention supprimée avec succès
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Intervention non trouvée
 */
interventionRouter.delete('/:id', deleteIntervention, errorHandler );

/**
 * @swagger
 * /api/interventions:
 *   get:
 *     summary: Récupérer toutes les interventions
 *     tags: [Interventions]
 *     responses:
 *       200:
 *         description: Liste des interventions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Intervention'
 */
interventionRouter.get('/', getAllInterventions, errorHandler );



export default interventionRouter;