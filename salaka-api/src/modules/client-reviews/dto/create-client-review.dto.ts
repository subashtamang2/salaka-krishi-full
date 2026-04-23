import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateClientReviewDto {
  @IsString()
  @ApiProperty({
    example: "John Doe",
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: "This is an amazing product! Highly recommend it.",
  })
  review: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "CEO at Example Corp",
  })
  position?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "https://example.com/images/john-doe.jpg",
  })
  imageUrl?: string;
}
