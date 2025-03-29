import { IsDefined, IsNumber } from "class-validator";

export class CreateIngestionValidation {
  @IsNumber()
  @IsDefined()
  documentId: number;
}
