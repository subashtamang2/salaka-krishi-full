import { Type } from "class-transformer";
import { IsOptional, IsNumber, IsString, IsEnum } from "class-validator";
import { ROLE, USER_STATUS } from "generated/prisma/enums";

export class CreateUserDto{}

export class FilterUsersDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(ROLE)
    role?: ROLE;

    @IsOptional()
    @IsEnum(USER_STATUS)
    status?: USER_STATUS;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc';
}
