import { v4 as uuidv4 } from 'uuid';
import Password from './passwordModem';

class extractValues {
  static userSignup(req) {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
    } = req.body;
    return {
      id: `${uuidv4()}`,
      username,
      password: `${Password.encrypt(password)}`,
      firstName,
      lastName,
      email,
      rateLimit: 10
    };
  }

  static userLogin(req) {
    const {
      username,
      password
    } = req.body;
    return {
      username,
      password
    };
  }
}

export default extractValues;
