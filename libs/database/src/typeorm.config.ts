import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { File } from '../../common/src/entities/files.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'oracle',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  sid: process.env.DB_SID,
  synchronize: false,
  logging: true,
  entities: [File],
};