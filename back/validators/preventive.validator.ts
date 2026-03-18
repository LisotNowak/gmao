import Joi from 'joi'

export const preventiveSchema = Joi.object({
  id: Joi.number().integer(),
  title: Joi.string().allow(null, ''),
  description: Joi.string().allow(null, ''),
  process: Joi.string().allow(null, ''),
  date: Joi.date().iso().allow(null),
  statusId: Joi.number().integer().allow(null),
  serviceId: Joi.number().integer().allow(null),
  materialId: Joi.number().integer().allow(null),
  validationCode: Joi.number().integer().allow(null),
  is_recurring: Joi.boolean().allow(null),
  recurrence_days: Joi.number().integer().min(1).allow(null),
})
