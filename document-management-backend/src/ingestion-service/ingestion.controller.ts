import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CheckPermissions } from "src/middlewares/permission-middleware/check-permission";
import { JwtAuthGuard } from "src/middlewares/auth-middleware/authentication.middleware";
import { PermissionGuard } from "src/middlewares/auth-middleware/authorization.middleware";
import { Action } from "src/types/permissions";
import { CreateIngestionValidation } from "./validations/ingestion.validation";
import { IngestionService } from "./ingestion.service";

@Controller("ingestion")
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @CheckPermissions((ability) => ability.can(Action.WRITE, "Ingestion"))
  create(@Body() createIngestionDto: CreateIngestionValidation) {
    return this.ingestionService.addIngestion(createIngestionDto);
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @CheckPermissions((ability) => ability.can(Action.READ, "Ingestion"))
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.ingestionService.findIngestionById(id);
  }
}
