import 'dotenv/config';
import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { DATABASE_URL, SERVER_PORT } from './shared/env';
import { AuthorizedRequest } from './shared/types/authorized-request';
import { usersRouter } from './routes/users';
import { cardsRouter } from './routes/cards';
import { notFoundRouter } from './routes/not-founded';

mongoose.set('strictQuery', false);
mongoose.connect(DATABASE_URL);

const app = express();
app.use(express.json());
app.use((req: AuthorizedRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '8f2eae09b01ce7763d5a9b55',
  };

  next();
});

app.use(usersRouter);
app.use(cardsRouter);
app.use(notFoundRouter);

app.listen(SERVER_PORT, () => {
  console.log(`Приложение запущено на порту ${SERVER_PORT}`);
});
