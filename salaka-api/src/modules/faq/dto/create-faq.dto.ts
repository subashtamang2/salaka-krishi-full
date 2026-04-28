 import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsLowercase, IsString } from "class-validator";
import { FAQ_CATEGORY } from "@prisma/client";

export class CreateFaqDto {
  @IsString()
  @ApiProperty({
    example: "Do you ship overseas?",
  })
  question: string;

  @IsString()
  @IsLowercase()
  @ApiProperty({
    example: "do you ship overseas?",
  })
  slug: string;

  @IsString()
  @ApiProperty({
    example:
      "Yes, we ship all over the world. Shipping costs will apply, and will be added at checkout. We run discounts and promotions all year, so stay tuned for exclusive deals.",
  })
  answer: string;

  @IsEnum(FAQ_CATEGORY)
  @ApiProperty({
    example: "SHIPPING",
    enum: FAQ_CATEGORY,
    enumName: "FAQ_CATEGORY",
  })
  category: FAQ_CATEGORY;
}
