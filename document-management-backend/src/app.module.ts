import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClsModule } from "nestjs-cls";
import { DatabaseModule } from "./database/database.module";
import { DocumentModule } from "./doc-management/doc-uploads.module";
import { MiddlewareModule } from "./middlewares/handler.module";
import { getConfig } from "./middlewares/services/app-config/configuration";
import { IngestionModule } from "./ingestion-service/ingestion.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [getConfig],
      envFilePath: ["../.env"],
    }),
    MiddlewareModule,
    DatabaseModule,
    UserModule,
    DocumentModule,
    IngestionModule,
  ],
})
export class ApplicationModule {}
