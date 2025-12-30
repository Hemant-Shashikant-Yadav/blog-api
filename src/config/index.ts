import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  WHITELISTED_DOMAINS: ['https:/some-vercel-domain'],

  DB_NAME: process.env.DB_NAME,
  APP_NAME: process.env.APP_NAME,
  MONGO_URI: process.env.MONGO_URI,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
};

export default config;
