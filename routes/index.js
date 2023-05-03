import express from 'express';
import dotenv from 'dotenv';

import auth from './authRoute';
import mail from './mailRoute';

import { statusCodes, ResponseHandler } from '../helpers';

dotenv.config();
const router = express.Router();
const { success, badRequest } = statusCodes;
const { BASE_URL='' } = process.env;

router.use('/auth', auth);
router.use('/mail', mail);


router.use('/', (req, res) =>
(BASE_URL.includes(req.originalUrl)
  ? ResponseHandler.success(res, success, 'Rate Limiter demo root')
  : ResponseHandler.error(res, badRequest, 'Bad request, Invalid route')));

export default router;
