import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";

export class CreateCartDto {
    @IsNumber({ maxDecimalPlaces: 0 })
    @IsOptional()
    quantity?: number;

    @IsUUID()
    @IsNotEmpty()
    productId: string;

}
