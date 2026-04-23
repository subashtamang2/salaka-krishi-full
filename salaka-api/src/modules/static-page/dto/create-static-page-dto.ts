import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateStaticPageDto {
    @ApiProperty({ example: "These are the terms and conditions..." })
    @IsString()
    content: string;
}
