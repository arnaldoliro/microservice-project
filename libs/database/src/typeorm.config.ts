import { User } from "@app/common";
import { ConfigService } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";

export const getTypeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
    type: 'oracle',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    sid: configService.get<string>('DB_SID'),
    entities: [User],
    synchronize: false
})