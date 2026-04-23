import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOverallReviewDto {
    @IsString()
    @ApiProperty({
        example: "Ram Shrestha",
    })
    name: string;

    @ApiProperty({ example: "example@gmail.com" })
    @IsEmail()
    email: string;

    @IsString()
    @ApiProperty({
        example: "This is an amazing product! Highly recommend it.",
    })
    review: string;

    @IsNumber({ maxDecimalPlaces: 1 })
    @ApiProperty({ example: 4.5 })
    rating: number;


    @IsString()
    @IsOptional()
    @ApiProperty({
        example: "https://example.com/images/john-doe.jpg",
    })
    imageUrl?: string;
}
