import { PartialType } from "@nestjs/swagger";
import { CreateAdminDto } from "./create-admin.dto";
import { IsEnum, IsOptional } from "class-validator";
import { USER_STATUS } from "@prisma/client";

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsOptional()
    @IsEnum(USER_STATUS)
    status?: USER_STATUS;
}
