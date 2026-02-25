-- Finalize script: Reset sequences after restoring dump
-- This ensures sequences match the highest ID in each table

SELECT setval('public."Service_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Service"));
SELECT setval('public."Role_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Role"));
SELECT setval('public."Category_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Category"));
SELECT setval('public."Type_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Type"));
SELECT setval('public."Priority_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Priority"));
SELECT setval('public."Localisation_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Localisation"));
SELECT setval('public."Parent_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Parent"));
SELECT setval('public."Status_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Status"));
SELECT setval('public."User_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "User"));
SELECT setval('public."Intervention_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Intervention"));
SELECT setval('public."Material_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Material"));
SELECT setval('public."Documentation_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Documentation"));
SELECT setval('public."Movement_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Movement"));
SELECT setval('public."Preventive_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "Preventive"));
SELECT setval('public."MaterialPreventive_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "MaterialPreventive"));
SELECT setval('public."MaterialIntervention_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "MaterialIntervention"));
SELECT setval('public."StatusIntervention_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "StatusIntervention"));
SELECT setval('public."UserIntervention_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "UserIntervention"));
SELECT setval('public."UserPreventive_id_seq"', (SELECT COALESCE(MAX(id), 0) + 1 FROM "UserPreventive"));
