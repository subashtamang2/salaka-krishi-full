import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
@IsNumber({ maxDecimalPlaces: 1 })
@ApiProperty({ example: 4.5 })
rating: number;

@IsString()
@ApiProperty({ example: "This is a great product!" })
comment: string;
}
