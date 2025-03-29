/* eslint-disable no-undef */
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CheckPermissions } from "src/middlewares/permission-middleware/check-permission";
import { JwtAuthGuard } from "src/middlewares/auth-middleware/authentication.middleware";
import { PermissionGuard } from "src/middlewares/auth-middleware/authorization.middleware";
import { Action } from "src/types/permissions";
import { DocumentService } from "./doc-uploads.service";

@ApiTags("document")
@Controller("document")
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBearerAuth()
  @ApiBody({
    description: "Upload a document file",
    schema: {
      type: "object",
      properties: {
        files: {
          type: "file",
          format: "binary",
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor("document"))
  @CheckPermissions((ability) => ability.can(Action.WRITE, "Document"))
  async createDocument(@UploadedFile() document: Express.Multer.File) {
    const newDocument = await this.documentService.create(document);

    return {
      message: "Document successfully uploaded",
      document: {
        id: newDocument.id,
      },
    };
  }

  @Get(":id")
  @ApiBearerAuth()
  @CheckPermissions((ability) => ability.can(Action.READ, "Document"))
  async getDocumentById(@Param("id", ParseIntPipe) id: number) {
    const stream = await this.documentService.retrieveDocument(id);

    return new StreamableFile(stream);
  }

  @Put(":id")
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Replace an existing document with a new upload",
    schema: {
      type: "object",
      properties: {
        files: {
          type: "file",
          format: "binary",
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor("document"))
  @CheckPermissions((ability) => ability.can(Action.UPDATE, "Document"))
  async updateDocument(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() document: Express.Multer.File,
  ) {
    await this.documentService.updateDocument(id, document);

    return {
      message: "Document Updated Successfully",
    };
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @CheckPermissions((ability) => ability.can(Action.READ, "Document"))
  async listDocuments() {
    return this.documentService.listDocuments();
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @CheckPermissions((ability) => ability.can(Action.DELETE, "Document"))
  async deleteDocument(@Param("id", ParseIntPipe) id: number) {
    await this.documentService.deleteDocument(id);

    return {
      message: "Document successfully removed",
    };
  }
}
