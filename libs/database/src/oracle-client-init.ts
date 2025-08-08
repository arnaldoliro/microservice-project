import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

export function initOracleClient() {
  if (process.env.ORACLE_CLIENT_PATH) {
    oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_PATH });
  }
}
