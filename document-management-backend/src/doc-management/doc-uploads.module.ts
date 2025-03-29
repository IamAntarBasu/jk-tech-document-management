import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterAsyncOptionsFactory } from "src/configurations/file-upload.config";
import { DocumentController } from "./doc-uploads.controller";
import { DocumentService } from "./doc-uploads.service";
import { DocumentEntity } from "./entities/doc-management.entity";

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterAsyncOptionsFactory,
    }),
    TypeOrmModule.forFeature([DocumentEntity]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
