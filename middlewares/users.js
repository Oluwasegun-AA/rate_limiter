import db from '../models';
import {
  ResponseHandler,
  statusCodes,
  Jwt
} from '../helpers';

import request from '../models/requestController';

const invalidTokenMessage = res => {
  ResponseHandler.error(
    res,
    statusCodes.unauthorized,
    'Unauthorized: Invalid Token'
  );
};

const checkUserExist = async (req, res, next) => {
  const {
    url,
  } = req;
  const response = await db.findUser(req, res);
  if (response && (url === '/signup' || url === '/')) {
    return ResponseHandler.error(
      res,
      statusCodes.conflict,
     'User Already signed up'
    );
  }
  if (!response && (url === '/login')) {
    return ResponseHandler.error(
      res,
      statusCodes.notFound,
      'User Not Found'
    );
  }
  if (url === '/login') req.user = response;
  next();
};

const checkUserInToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  Jwt.decrypt(req, res, token);
  const response = await request.findTokenUser(req, res);
  if (!response) return invalidTokenMessage(res);
  next();
};

export {
  checkUserExist,
  checkUserInToken,
};
