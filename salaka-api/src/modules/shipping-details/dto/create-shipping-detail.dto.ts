import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingDetailDto {
  @ApiProperty({ example: "123 Main St" })
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "+1-202055-5655" })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "uuid", required: false })
  userId?: string;
}
