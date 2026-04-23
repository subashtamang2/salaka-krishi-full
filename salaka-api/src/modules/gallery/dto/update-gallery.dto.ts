import { PartialType } from "@nestjs/swagger";
import { CreateGalleryDto } from "./create-gellery.dto";

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {}
