import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class RejectProofDto {
    @ApiPropertyOptional({ example: "Receipt screenshot is blurry or illegiable" })
    @IsOptional()
    @IsString()
    note?: string;
}
