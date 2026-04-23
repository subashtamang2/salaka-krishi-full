import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsString, IsUUID } from "class-validator";
import { ROLE, USER_STATUS } from "generated/prisma/enums";

export class User {
    @ApiProperty()
    @Expose()
    @IsUUID()
    id: string;

    @ApiProperty()
    @Expose()
    @IsString()
    firstName: string;
  @ApiProperty()
    @Expose()
    @IsString()
    lastName: string;

    @ApiProperty()
    @Expose()
    @IsString()
    profileUrl: string;

    @ApiProperty()
    @Expose()
    @IsString()
    email: string;

    @ApiProperty()
    @Expose()
    @IsEnum(ROLE)
    role: ROLE;

    @ApiProperty()
    @Expose()
    @IsEnum(USER_STATUS)
    status: USER_STATUS;

    @ApiProperty()
    @Expose()
    createdAt: Date;


    @ApiProperty()
    @Expose()
    @IsDate()
    updatedAt: Date;

    @ApiProperty()
    @Exclude()
    @IsString()
    Cart: string;

    @ApiProperty()
    @Exclude()
    @IsString()
    Wishlists: string;

    @Expose()
    @IsNumber()
    noOfProductIncart: number;
}
