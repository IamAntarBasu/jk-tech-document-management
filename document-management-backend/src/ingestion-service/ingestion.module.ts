import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DocumentEntity } from "src/doc-management/entities/doc-management.entity";
import { UserEntity } from "src/user/models/user.entity";
import { IngestionController } from "./ingestion.controller";
import { IngestionService } from "./ingestion.service";
import { ClientsModule } from "@nestjs/microservices";
import { ClientOptionsFactory } from "src/configurations/redis-connection.config";
import { INGESTION_SERVICE } from "src/middlewares/constants/ingestion";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DocumentEntity]),
    ClientsModule.registerAsync({
      clients: [
        {
          name: INGESTION_SERVICE,
          useClass: ClientOptionsFactory,
        },
      ],
    }),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
