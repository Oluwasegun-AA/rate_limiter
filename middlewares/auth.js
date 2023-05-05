import { pick, omit } from 'lodash';
import joi from 'joi';
import { joiValidateHelper } from '../helpers';

const rules = {
  username: joi
    .string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  firtName: joi
    .string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  lastName: joi
    .string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  email: joi
    .string()
    .max(256)
    .email({ minDomainSegments: 2 })
    .required(),
  password: joi
    .string()
    .min(6)
    .max(15)
    .required(),
};

const signupSchema = joi.object(omit(rules));
const loginSchema = joi.object(pick(rules, ['username', 'password']));

const validateSignupData = async (req, res, next) =>
  joiValidateHelper(req, res, next, signupSchema);

const validateLoginData = async (req, res, next) =>
  joiValidateHelper(req, res, next, loginSchema);

export { validateSignupData, validateLoginData };
