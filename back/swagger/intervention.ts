/**
 * @swagger
 * components:
 *   schemas:
 *     Intervention:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Révision du système hydraulique"
 *         description:
 *           type: string
 *           example: "Inspection et maintenance complète du système hydraulique."
 *         detail:
 *           type: string
 *           example: "Le tracteur présentait une fuite sur le vérin droit."
 *         initial_comment:
 *           type: string
 *           example: "Le problème a été signalé par l'opérateur."
 *         final_comment:
 *           type: string
 *           example: "Remplacement des joints et test réussi."
 *         begin_date:
 *           type: string
 *           format: date-time
 *           example: "2025-07-10T09:00:00Z"
 *         picture:
 *           type: string
 *           format: binary
 *           description: Fichier binaire encodé (photo, document, etc.)
 *         mimetype:
 *           type: string
 *           example: "image/jpeg"
 *         serviceId:
 *           type: integer
 *           example: 2
 *         localisationId:
 *           type: integer
 *           example: 5
 *         statusId:
 *           type: integer
 *           example: 1
 *         categoryId:
 *           type: integer
 *           example: 3
 *         priorityId:
 *           type: integer
 *           example: 4
 *         typeId:
 *           type: integer
 *           nullable: true
 *           description: "ID du domaine d'intervention (facultatif)"
 *           example: 6
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-10T08:30:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-10T11:00:00Z"
 */
