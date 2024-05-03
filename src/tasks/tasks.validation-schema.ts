import * as Joi from 'joi';
import { Status } from './tasks.enum';

export const CreateTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.number()
    .valid(...[0, 1, 2, 3, 4])
    .required(),
});

export const UpdateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  priority: Joi.number().valid(...[0, 1, 2, 3, 4]),
  status: Joi.string().valid(...Object.values(Status)),
});
