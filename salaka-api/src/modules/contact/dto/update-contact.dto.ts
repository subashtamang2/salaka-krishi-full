import { ApiProperty } from "@nestjs/swagger";

import { IsEnum } from "class-validator";
import { STATUS } from "generated/prisma/enums";

export class UpdateContactDto {
  @ApiProperty({
    enum: STATUS,
    enumName: "STATUS",
  })
  @IsEnum(STATUS)
  status: STATUS;
}
