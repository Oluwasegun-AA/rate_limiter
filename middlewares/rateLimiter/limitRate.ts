import { Store } from './types';
import type { Request, Response, NextFunction, RequestHandler } from 'express'
import { ResponseHandler, statusCodes } from '../../helpers'


//Create rate-limiting middleware
export const rateLimitter = (
  store: Store,
) => {
  const middleware = handleRateLimit(
    async (request: Request, response: Response, next: NextFunction) => {

      // Get a unique key for the client
      const key = generateClientkey(request);

      // Increment the client's api calls counter by one
      const { totalApiCalls, resetTime } = await store.increment(key);
      const maxLimit = store.maxLimit
      const remainingCalls = store.maxLimit - totalApiCalls;
      const requestRateInfo ={
        maxLimit: store.maxLimit,
        current: totalApiCalls,
        remaining: store.maxLimit < totalApiCalls ? 0 : remainingCalls,
        resetTime,
      };

      // Set the X-RateLimit headers on the response object
      if (!response.headersSent) {
        response.setHeader('X-RateLimit-Limit', requestRateInfo.maxLimit);
        response.setHeader(
          'X-RateLimit-Remaining',
          requestRateInfo.remaining,
        );

        if (resetTime) {
          response.setHeader('Date', new Date().toUTCString());
          response.setHeader(
            'X-RateLimit-Reset',
            Math.ceil(resetTime.getTime() / 1000),
          );
        }
      }

      //send error message when rate limit is exceeded
      if (maxLimit && totalApiCalls > maxLimit) {
        if (!response.headersSent) {
          // set the Retry-After header
          response.setHeader('Retry-After', Math.ceil(store.limtWindow / 1000));
        }
        sendLimitErrorMessage(response);
        return;
      }
      next();
    },
  )

  return middleware;
};


const generateClientkey =(request: Request): string =>{
  if (!request.ip) console.error('ip is undefined');
    return request.ip;
}

const sendLimitErrorMessage = (res: Response): Response => {
  const message = 'Too many requests, please try again later.';
  return ResponseHandler.error(
    res,
    statusCodes.tooManyRequest,
    message);
}

//Request handler to handle middle ware trigger and error handling
const handleRateLimit =
  (func: RequestHandler): RequestHandler =>
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        await Promise.resolve(func(request, response, next)).catch(next);
      } catch (error: unknown) {
        next(error);
      }
    };
