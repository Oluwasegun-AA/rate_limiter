import { pick } from 'lodash';
import db from '../models';
import {
  ResponseHandler,
  statusCodes,
  Jwt,
  Password,
} from '../helpers';

const { encrypt } = Jwt;

class Auth {
  static async login(req, res) {
    const validUser = Password.decrypt(req.body.password, req.user.password);
    if (validUser) {
      return ResponseHandler.success(
        res,
        statusCodes.success,
        'User Login Successful',
        {
          token: encrypt(pick(req.user, ['id', 'email', 'username', 'rateLimit'])),
        }
      );
    }
    return ResponseHandler.error(
      res,
      statusCodes.unauthorized,
      'Incorrect email or password'
    );
  }

  static async signup(req, res) {
    const data = await db.postUser(req, res);
    return ResponseHandler.success(res, statusCodes.created, 'User created Successfully', {
      token: encrypt(pick(data, ['id', 'username', 'rateLimit'])),
    });
  }
}

export default Auth;
