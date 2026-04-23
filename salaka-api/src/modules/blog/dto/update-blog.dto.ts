import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateBlogDto } from "./create-blog.dto";

export class UpdateBlogDto extends PartialType(
OmitType(CreateBlogDto,["slug"] as const)
){}
