import express from 'express';

import { catchAllError } from '../helpers';
import { mailController } from '../controllers';
import {
 checkUserInToken,
} from '../middlewares';

const mails = express.Router();
const {
  sendMail,
} = mailController;

mails.post('/', checkUserInToken, sendMail);

catchAllError(mails);

export default mails;
