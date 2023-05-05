import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from '../routes';
import { rateLimitter } from './index';
import RateLimitStore from './rateLimiter/store';

const rateLimitOptions = {
  limtWindow: 60 * 1000, // 1 min
  maxLimit: 10,
}
// init limit tracker
const store = new RateLimitStore().init(rateLimitOptions);

const limitRate = rateLimitter(store);

const serverMiddleWares = app => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(logger('common'));
  app.use(limitRate);
  app.use('/api/v1', router);
};

export default serverMiddleWares;
