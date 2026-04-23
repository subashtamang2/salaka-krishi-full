
import { Exclude, Expose } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsString, IsUUID } from "class-validator";
import { CATEGORY_STATUS } from "generated/prisma/enums";
export class Category {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  slug: string;

  @Expose()
  @IsString()
  imageUrl: string;

  @Expose()
  @IsEnum(CATEGORY_STATUS)
  status: CATEGORY_STATUS;

  @Expose()
  _count: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;

  @Expose()
  @IsArray()
  products: any[];
}
