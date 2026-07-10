import Joi from "joi";

export const createTicketValidation = Joi.object({
  subject: Joi.string().required(),

  description: Joi.string().required(),

  category: Joi.string().required(),

  priority: Joi.string()
    .valid("low", "medium", "high")
    .required(),
});
