import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { getTypeOrmConfig } from './typeorm.config';
import * as oracledb from 'oracledb';

@Injectable()
export class DatabaseService implements OnModuleInit{
    private dataSource: DataSource;

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        try{
            oracledb.initOracleClient({ libDir: this.configService.get<string>('ORACLE_CLIENT_PATH'), })

            const options = getTypeOrmConfig(this.configService);
            this.dataSource = new DataSource(options)
            await this.dataSource.initialize();
            console.log('Conexão com o banco estabelecida com sucesso!')
        } catch(error) {
            console.error('Falha ao conectar ao banco:', error)
        }
    }

    getDataSource(): DataSource {
        return this.dataSource
    }
}
