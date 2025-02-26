import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: process.env.ENVIRONMENT === 'development',
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export { sequelize, connectDB };
