import { PartialType } from "@nestjs/swagger"
import { CreateFileSystemDto } from "./create-file-system.dto"

export class UpdateFileSystemDto extends PartialType(CreateFileSystemDto) {}
