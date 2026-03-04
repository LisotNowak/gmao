import type { NextFunction, Request, Response } from 'express';
import type { IErrorDetails } from '../@types/IErrorDetails';

const errorHandler = (
  // biome-ignore lint/suspicious/noExplicitAny: error peut être n'importe quoi
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  // Erreurs de validation Joi → 400 Bad Request (pas 500)
  if (err.isJoi || err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message,
      details: Array.isArray(err.details)
        ? err.details.map((d: any) => d.message)
        : err.details,
    });
  }

  const status = (err as IErrorDetails).status || 500;
  const message = err.message || 'Une erreur est survenue sur le serveur';
  const details = (err as IErrorDetails).details || undefined;

  res.status(status).json({
    message,
    details,
  });
};

export default errorHandler;