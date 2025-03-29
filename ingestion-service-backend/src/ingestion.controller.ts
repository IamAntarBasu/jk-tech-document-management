import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IngestionService } from './ingestion.service';
import { IngestionValidation } from './validations/add-ingestion.validation';

@Controller()
export class IngestionController {
  constructor(private readonly appService: IngestionService) {}

  @MessagePattern('add.ingestion')
  async addIngestion(data: IngestionValidation) {
    const ingestion = await this.appService.addIngestion(data);

    return {
      message: 'Ingestion process initiated successfully',
      ingestion,
    };
  }

  @MessagePattern('get.ingestion')
  async getIngestion(id: number) {
    const ingestion = await this.appService.getIngestion(id);

    return {
      message: 'Ingestion details retrieved successfully',
      ingestion,
    };
  }
}
