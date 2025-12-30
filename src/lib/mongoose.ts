import mongoose from 'mongoose';

import config from '@/config';

import type { ConnectOptions } from 'mongoose';
import { logger } from './winstone';

const clientOptions: ConnectOptions = {
  dbName: config.DB_NAME,
  appName: config.APP_NAME,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

/**
 * Establish a connection to the MongoDB database.
 *
 * - Attempts to connect to the MongoDB database using the provided configuration.
 * - Logs a success message upon successful connection.
 * - Logs an error message and exits the process if an error occurs during the connection process.
 * - Exits the process with a non-zero status code if an error occurs during the connection process.
 *
 * - Uses `MONGO_URI` as connection string
 * - `clientOptions` contains additional configuration for Mongoose.
 */
export const connectDB = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables');
  }
  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info('Connected to MongoDB', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    logger.error('Error connecting to MongoDB:', error);
  }
};

/**
 *  Closes the MongoDB connection.
 *
 * - Closes the MongoDB connection using `mongoose.connection.close()`.
 * - Logs a success message upon successful disconnection.
 * - Logs an error message and exits the process if an error occurs during the disconnection process.
 * - Exits the process with a non-zero status code if an error occurs during the disconnection process.
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.warn('Disconnected from MongoDB', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    logger.error('Error disconnecting from MongoDB:', error);
  }
};
