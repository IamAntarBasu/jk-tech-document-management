import { IsDefined, IsNumber } from 'class-validator';

export class IngestionValidation {
  @IsNumber()
  @IsDefined()
  documentId: number;

  @IsNumber()
  @IsDefined()
  userId: number;
}
