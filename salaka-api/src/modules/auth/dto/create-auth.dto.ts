/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString
} from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: "user@example.com" })
    email: string;

    @IsString()
    @ApiProperty({ example: "john " })
    firstName: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: "Doe", required: false })
    lastName: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: "https://example.com/profile.jpg", required: false })
    profileUrl?: string;

    @IsBoolean()
    @IsOptional()
    isGoogleLogin?: boolean;

    @IsBoolean()
    @IsOptional()
    isFacebookLogin?: boolean;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: "password123", required: false })
    password?: string;


}
