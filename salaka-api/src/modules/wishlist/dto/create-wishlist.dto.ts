import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
export class CreateWishlistDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ example: "blogId" })
    productId: string;
}
