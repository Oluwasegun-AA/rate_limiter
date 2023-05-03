import joi from 'joi';
import {
  joiValidateHelper,
} from '../helpers';

const rules = {
  email: joi
    .string()
    .max(256)
    .email({ minDomainSegments: 2 })
    .required(),
  message: joi
    .string()
    .min(3)
    .max(100)
    .required(),
  subject: joi.string().required(),
  authorId: joi.string().guid({
    version: ['uuidv4'],
  }),
};

const postMailsSchema = joi.object(rules);

const validatePostMail = async (req, res, next) =>
  joiValidateHelper(req, res, next, postMailsSchema);

export default validatePostMail;
