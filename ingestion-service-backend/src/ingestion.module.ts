import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getConfig } from './configuration/configuration';
import { DatabaseModule } from './database/database.module';
import { IngestionEntity } from './models/ingestion.entity';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [getConfig],
      envFilePath: ['../.env'],
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      global: true,
      wildcard: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([IngestionEntity]),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
