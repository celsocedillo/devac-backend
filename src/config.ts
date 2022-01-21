import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    },
    oracle: {
      sid: process.env.ORACLE_SID,
      port: parseInt(process.env.ORACLE_PORT, 10),
      password: process.env.ORACLE_PASSWORD,
      user: process.env.ORACLE_USER,
      host: process.env.ORACLE_HOST,
    },
    serverPort: process.env.SERVER_PORT,
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET
  };
});