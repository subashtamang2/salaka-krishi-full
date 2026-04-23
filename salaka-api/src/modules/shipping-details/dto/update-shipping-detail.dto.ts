import { PartialType } from "@nestjs/swagger";
import { CreateShippingDetailDto } from "./create-shipping-detail.dto";

export class UpdateShippingDetailDto extends PartialType(CreateShippingDetailDto) {}
