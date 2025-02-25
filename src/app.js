import express from 'express';
import authRouter from './routes/authRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

dotenv.config({
  path: './.env',
});

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('server ok tested!');
});

app.use('/api/v1/auth', authRouter);

export default app;
