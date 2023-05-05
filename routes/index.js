import express from 'express';
import dotenv from 'dotenv';

import auth from './authRoute';
import mail from './mailRoute';

import { statusCodes, ResponseHandler } from '../helpers';

dotenv.config();
const router = express.Router();
const { success, badRequest } = statusCodes;

router.use('/auth', auth);
router.use('/mail', mail);


router.use('/', (req, res) => {
  if (req.originalUrl == '/api/v1' || req.originalUrl == '/api/v1/') {
    ResponseHandler.success(res, success, 'Rate Limiter demo root')
  } else {
    ResponseHandler.error(res, badRequest, `Bad request, Invalid route ${req.originalUrl}`);
  }
})

export default router;
