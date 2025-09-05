import { errors } from 'celebrate';
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { DATABASE_URL, SERVER_PORT } from './shared/env';
import {
  validateLoginSchema,
  validateCreateUserSchema,
} from './shared/validators/request-validators';
import { usersRouter } from './routes/users';
import { cardsRouter } from './routes/cards';
import { notFoundRouter } from './routes/not-founded';
import { createUser, login } from './controllers/users';
import { authMiddleware } from './middlewares/auth';
import { centralizedErrorHandler } from './middlewares/centralized-error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';

mongoose.connect(DATABASE_URL).catch((err) => {
  console.error('Ошибка! Не удалось подключиться к серверу', err);
});

const app = express();
app.use(express.json());

app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', validateLoginSchema, login);
app.post('/signup', validateCreateUserSchema, createUser);

app.use('/users', authMiddleware, usersRouter);
app.use('/cards', authMiddleware, cardsRouter);

app.use(notFoundRouter);

app.use(errorLogger);
app.use(errors());

app.use(centralizedErrorHandler);

app.listen(SERVER_PORT, () => {
  console.log(`Приложение успешно запущено! Порт - ${SERVER_PORT}`);
});
