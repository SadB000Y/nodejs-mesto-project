import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../shared/errors/not-found-error';

export const notFounded = async (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
};