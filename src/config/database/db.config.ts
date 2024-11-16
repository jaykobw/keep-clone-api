import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import logger from '../../utils/Logger';
import dbConfig from './config.json';
import path from 'path';

dotenv.config({
  path: './.env',
});

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env as keyof typeof dbConfig];

const DB_HOST = process.env.DB_HOST || config.host;
const DB_NAME = (process.env.DB_DATABASE as string) || config.database;
const DB_USERNAME = (process.env.DB_USERNAME as string) || config.username;
const DB_PASSWORD = process.env.DB_PASSWORD || `${config.password}`;
const DB_PORT = Number(process.env.DB_PORT) || config.port;

export const useSequelizeConnection = new Sequelize({
  dialect: 'postgres',
  host: '127.0.0.1',
  username: DB_USERNAME,
  password: 'postgres',
  database: DB_NAME,
  port: DB_PORT,
  logging:
    process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  models: [path.join(__dirname, '../..', '/models')],
  dialectOptions: {},
  timezone: '+03:00',
});

const initializeDBConnection = async (): Promise<void> => {
  try {
    await useSequelizeConnection.authenticate();
    await useSequelizeConnection.sync({
      force: false,
      alter: false,
    });
    logger.info('Database connected succesfully!');
  } catch (e: unknown) {
    logger.info(
      `Failed to sync database connection with error : ${(e as any)?.message}`,
    );
  }
};

export default initializeDBConnection;
