import { Global, Module } from "@nestjs/common";
import { CaslModule } from "./access-control-rule-middleware/access-control.module";

@Global()
@Module({
  imports: [CaslModule],
  providers: [],
  exports: [CaslModule],
})
export class GlobalModule {}
