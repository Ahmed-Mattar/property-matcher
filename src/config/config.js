import dotenv from 'dotenv';

dotenv.config();

export default {
  dbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '1h'
};