import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/models/user.entity";
import { CaslAbilityFactory } from "./access-control.middlewares";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
