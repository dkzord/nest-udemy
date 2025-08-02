import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  database: {
    type: process.env.DB_TYPE as 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: Boolean(process.env.DB_SYNCHRONIZE),
    synchronize: Boolean(process.env.DB_AUTO_LOAD_ENTITIES),
  },
  environment: process.env.NODE_ENV || 'development',
}));
