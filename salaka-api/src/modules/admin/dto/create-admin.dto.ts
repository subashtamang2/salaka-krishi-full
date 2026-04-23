import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, isString, MinLength } from "class-validator";
import { ROLE } from "generated/prisma/enums";

export class CreateAdminDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(ROLE)
    role: ROLE;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;


    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsString()
    profileUrl?: string;
}

import { Type } from "class-transformer";
import { IsNumber, IsBoolean } from "class-validator";
import { USER_STATUS } from "generated/prisma/enums";

export class FilterAdminsDto {
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
