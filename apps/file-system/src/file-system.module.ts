import { Module } from '@nestjs/common';
import { FileSystemController } from './file-system.controller';
import { FileSystemService } from './file-system.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@app/database/database.module';
import { File } from '@app/common/entities/files.entity'

@Module({
    imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([File]),
  ],
  controllers: [FileSystemController],
  providers: [FileSystemService],
})
export class FileSystemModule {}
