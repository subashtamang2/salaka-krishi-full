import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { BlogRepo } from "./blog.repo";

@Module({
imports: [PrismaModule],
controllers: [BlogController],
providers:[BlogService, BlogRepo],
})
export class BlogModule{}
