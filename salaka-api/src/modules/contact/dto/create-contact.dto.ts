import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateContactDto {
  @ApiProperty({ example: "Ram" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "Bouddha,Kathmandu" })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: "Ram@gmail.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "9800000000" })
  @IsString()
  phone: string;

  @ApiProperty({ example: "Subject of the message" })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
