import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeORMFactory } from "src/configurations/typeorm.config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMFactory,
    }),
  ],
})
export class DatabaseModule {}
