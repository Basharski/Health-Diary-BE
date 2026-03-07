// AI-avusteinen: tiedoston sisältöä on tarkennettu Copilotin avulla.
import { validationResult } from 'express-validator';

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message,
    error: {
      message: err.message,
      status,
      ...(err.errors ? { errors: err.errors } : {})
    }
  });
};

const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req, { strictParams: ['body'] });
  if (!errors.isEmpty()) {
    const error = new Error('Bad Request');
    error.status = 400;
    error.errors = errors.array({ onlyFirstError: true }).map((err) => {
      return { field: err.path, message: err.msg };
    });
    return next(error);
  }
  next();
};

export { notFoundHandler, errorHandler, validationErrorHandler };
