/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginAuthDto {
@IsEmail()
@ApiProperty({ example: "user@example.com"})
email:string;

@IsString()
@ApiProperty({ example: "password123"})
password: string;
}
