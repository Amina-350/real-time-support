import Joi from "joi";

export const createMessageValidation = Joi.object({
  ticketId: Joi.string().required(),

  receiverId: Joi.string().required(),

  message: Joi.string().trim().required(),
});
