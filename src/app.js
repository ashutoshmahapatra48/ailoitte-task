import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerDocs from './docs/swagger.js';
import authRouter from './routes/authRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import productRouter from './routes/productRoutes.js';

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
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);

// Initialize Swagger Documentation
swaggerDocs(app);

export default app;
