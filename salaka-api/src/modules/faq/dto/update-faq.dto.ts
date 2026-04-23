import { OmitType } from "@nestjs/swagger";
import { CreateFaqDto } from "./create-faq.dto";

export class UpdateFaqDto extends OmitType(CreateFaqDto, ["slug"]) {}

