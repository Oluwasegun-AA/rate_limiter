import statusCodes from './status';

const connectionMessage = (port) => process.stdout.write(`Server started on port ${port}`);

const catchAllError = app =>
  app.use('*', ({ method, originalUrl }, res) =>
    res.status(statusCodes.badRequest).send({
      message: `Endpoint ${method} ${originalUrl} does not exist. Please, verify the request is valid`,
    }));

export {
  connectionMessage,
  catchAllError,
};
