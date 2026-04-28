import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  NotFoundException,
} from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { JwtPayload } from "../auth/interface";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Serializer } from "../../interceptors/serializer.interceptor";
import { BlogReponse, PaginatedBlogResponse } from "./entities/blog.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorators";
import { ROLE } from "@prisma/client";

@Controller("blog") // Assuming you want to serialize the response with CreateBlogDto
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Assuming you have a JwtAuthGuard to protect this route
  @Roles("Admin", "SuperAdmin") // Only allow users with 'Admin' or 'SuperAdmin' roles to create a blog
  @Serializer(BlogReponse)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: { user: JwtPayload }, // Assuming JwtPayload is the type for the decoded JWT token
    @Body() createBlogDto: CreateBlogDto
  ) {
    const auther = req?.user;
    const blog = await this.blogService.create(createBlogDto, auther);
    return {
      message: "Blog added successfully",
      data: blog,
    };
  }

  @Get("/info/:slug")
  @Serializer(BlogReponse)
  @HttpCode(HttpStatus.OK)
  async findBlogBySlug(@Param("slug") slug: string) {
    const data = await this.blogService.findBlogBySlug(slug);
    return {
      message: "Blog fetched successfully",
      data: data,
    };
  }
  @Get("/all")
  @Serializer(PaginatedBlogResponse)
  @HttpCode(HttpStatus.OK)
  async findAll(@Query("page") page?: number, @Query("limit") limit?: number) {
    const data = await this.blogService.findPublishedBlog(
      Number(page),
      Number(limit)
    );
    return {
      message: "Published blogs fetched successfully",
      data,
    };
  }

  @Get()
  @Serializer(BlogReponse)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async findAdminAll(@Req() req: { user: JwtPayload }) {
    const user = req?.user;
    const data = await this.blogService.findAll(user);
    if (data.length === 0) {
      throw new NotFoundException("No blogs found");
    }
    return {
      message: "Blogs fetched successfully",
      data,
    };
  }

  @Get("category/:slug")
  @Serializer(BlogReponse)
  @HttpCode(HttpStatus.OK)
  async findByCategory(@Param("slug") slug: string) {
    const data = await this.blogService.findByCategorySlug(slug);
    return {
      message: "Blogs fetched successfully",
      data: data,
    };
  }

  @Get(":id")
  @Serializer(BlogReponse)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const data = await this.blogService.findOne(id);
    return {
      message: "Blog fetched successfully",
      data: data,
    };
  }

  @Patch(":id")
  @Serializer(BlogReponse)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("Admin", "SuperAdmin")
  async update(@Param("id") id: string, @Body() updateBlogDto: UpdateBlogDto) {
    const data = await this.blogService.update(id, updateBlogDto);
    return {
      message: "Blog updated successfully",
      data: data,
    };
  }

  @Delete(":id")
  @Serializer(BlogReponse)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("Admin", "SuperAdmin")
  async remove(@Param("id") id: string) {
    const data = await this.blogService.remove(id);
    return {
      message: `Blog removed successfully`,
      data: data,
    };
  }
}
