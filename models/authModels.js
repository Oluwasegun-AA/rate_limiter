import request from './requestController';
import { extractValues } from '../helpers';

const findUser = async (req, res) => {
  const resp = await request.findOne(req, res, 'Users', 'email');
  return resp;
};

const postUser = async (req, res) => {
  const values = extractValues.userSignup(req);
  const resp = await request.post(res, 'Users', values);
  return resp;
};

export {
  findUser,
  postUser
};
