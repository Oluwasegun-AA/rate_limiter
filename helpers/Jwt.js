import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ResponseHandler from './ResponseHandler';
import statusCodes from './status';

dotenv.config();
const { SECRET } = process.env;

class Jwt {
  static encrypt(data) {
    return jwt.sign(data, SECRET, {
      expiresIn: 60 * 60, // expires in 1 hour
    });
  }

  static decrypt(req, res, token) {
    jwt.verify(token, SECRET, (err, data) => {
      if (err) {
        return ResponseHandler.error(
          res,
          statusCodes.unauthorized,
          'Unauthorized: Invalid Token'
        );
      }
      req.user = data;
    });
  }
}

export default Jwt;
