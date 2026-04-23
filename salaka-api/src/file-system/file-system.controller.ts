import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { storage, fileFilter } from "./files-system.helper";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import {
CreateFileSystemDto,
 CreateMultipleFileSystem
} from "./dto/create-file-system.dto";


@ApiTags("File System")
@Controller("files")
export class FileSystemController {
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage,
      fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 5 MB
    })
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: CreateFileSystemDto,
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File upload failed");
    }
    return {
      message: "File uploaded successfully",
      data: file,
    };
  }

  @Post("upload-multiple")
  @UseInterceptors(
    FilesInterceptor("files", 5, {
      storage,
      fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    })
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: CreateMultipleFileSystem,
  })
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException("No files uploaded");
    }
    return {
      message: `${files.length} Files uploaded successfully`,
      data: files,
    };
  }
}
