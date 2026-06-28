import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePasswordResetDto {
    @ApiProperty({
        example: "P@ssw0rd",
    })
    @IsString()
    @IsNotEmpty()
    password: string;
    @ApiProperty({
        example: "some-random-token",
    })
    @IsString()
    @IsNotEmpty()
    token: string;
}
