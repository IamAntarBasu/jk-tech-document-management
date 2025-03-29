import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { firstValueFrom } from "rxjs";
import { DocumentEntity } from "src/doc-management/entities/doc-management.entity";
import { INGESTION_SERVICE } from "src/middlewares/constants/ingestion";
import { UserEntity } from "src/user/models/user.entity";
import { Repository } from "typeorm";
import { CreateIngestionValidation } from "./validations/ingestion.validation";
import { IngestionResponse } from "./interface/ingestion-response.interface";
import { ClsService } from "nestjs-cls";

@Injectable()
export class IngestionService {
  constructor(
    @Inject(INGESTION_SERVICE)
    private readonly ingestionClient: ClientProxy,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly clsService: ClsService,
  ) {}

  /**
   *  Add a new ingestion
   * @param createIngestionValidation payload to create a new ingestion
   * @returns details of the created ingestion
   */
  addIngestion(createIngestionValidation: CreateIngestionValidation) {
    return firstValueFrom(
      this.ingestionClient.send<
        IngestionResponse,
        CreateIngestionValidation & { userId: number }
      >("add.ingestion", {
        userId: this.clsService.get<number>("authUser.id"),
        ...createIngestionValidation,
      }),
    );
  }

  /**
   * Get details of ingestion by id
   * @param id ingestion id
   * @returns the details of the ingestion
   */
  async findIngestionById(id: number) {
    const response = await firstValueFrom(
      this.ingestionClient.send<IngestionResponse, number>("get.ingestion", id),
    );

    const [document, user] = await Promise.all([
      this.documentRepository.findOneByOrFail({
        id: response.ingestion.documentId,
      }),
      this.userRepository.findOneByOrFail({ id: response.ingestion.userId }),
    ]);

    return {
      id: response.ingestion.id,
      user: {
        id: user.id,
        name: user.firstName,
        email: user.email,
      },
      document: {
        id: document.id,
        name: document.originalName,
      },
      status: response.ingestion.status,
    };
  }
}
