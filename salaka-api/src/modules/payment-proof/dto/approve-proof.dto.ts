import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ApproveProofDto {
    @ApiPropertyOptional({ example: "Payment verified successfully" })
    @IsOptional()
    @IsString()
    note?: string;
}
