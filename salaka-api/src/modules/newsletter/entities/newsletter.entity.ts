import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsString, IsUUID } from "class-validator";
import { Newsletter } from "@prisma/client";
import { NewsletterStatus } from "@prisma/client";

export class Newsletters implements Newsletter {
    @ApiProperty()
    @Expose()
    @IsUUID()
    id: string;

    @ApiProperty()
    @Expose()
    @IsEmail()
    email: string;

    @Expose()
    @ApiHideProperty()
    @IsString()
    status: NewsletterStatus;

    @Expose()
    @ApiHideProperty()
    createdAt: Date;

    @Expose()
    @ApiProperty()
    updatedAt: Date;
}
