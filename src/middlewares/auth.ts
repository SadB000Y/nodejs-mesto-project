import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../shared/errors/unauthorized-error';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');

    (req as any).user = payload;

    next();
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};
