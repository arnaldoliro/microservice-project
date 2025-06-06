import { User } from "@app/common";
import { ConfigService } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";

// Database de Dev
// export const getTypeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
//     type: 'oracle',
//     host: configService.get<string>('DB_HOST'),
//     port: configService.get<number>('DB_PORT'),
//     username: configService.get<string>('DB_USERNAME'),
//     password: configService.get<string>('DB_PASSWORD'),
//     sid: configService.get<string>('DB_SID'),
//     entities: [User],
//     synchronize: false
// })

// Database de Teste
export const getTypeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [User],
    synchronize: false
})