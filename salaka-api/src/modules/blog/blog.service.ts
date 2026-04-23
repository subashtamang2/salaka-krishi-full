import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { BlogRepo } from "./blog.repo";
import { JwtPayload } from "../auth/interface";
import { ROLE } from "generated/prisma/enums";

@Injectable()
export class BlogService {
  constructor(private readonly blogRepo: BlogRepo) { }

  async create(createBlogDto: CreateBlogDto, autherDetails: JwtPayload) {
    const auther = autherDetails.sub;
    const slug = createBlogDto.slug;
    const isUniqueSlug = await this.blogRepo.findBlogBySlug(slug);
    if (isUniqueSlug)
      throw new NotAcceptableException(
        "Slug must be unique. ie. Slug already exists"
      );

    const blog = await this.blogRepo.create(createBlogDto, auther);

    if (!blog) {
      throw new BadRequestException("Failed to create blog");
    }
    return blog;
  }

  async findPublishedBlog(page?: number, limit?: number) {
    const [total, items] = await this.blogRepo.findPublishedBlog(page, limit);
    if (total === 0) {
      throw new NotFoundException("No published blogs found");
    }
    return {
      total_no_of_post: total,
      post_per_page: limit ? limit : this.blogRepo["noOfPostsPerPage"],
      blogs: items,
    };
  }

  async findAll(user: JwtPayload, numbernumber?: number) {
    const role = user?.role;
    if (role === ROLE.SuperAdmin) {
      return await this.blogRepo.findAll();
    }
    return await this.blogRepo.findCurrentUserBlog(user.sub);
  }

  async findOne(id: string) {
    const data = await this.blogRepo.findOne(id);
    if (!data) throw new NotFoundException("Blog not found");

    return data;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const data = await this.blogRepo.update(id, updateBlogDto);
    if (!data) throw new NotFoundException("Blog not found");
    return data;
  }

  async remove(id: string) {
    const data = await this.blogRepo.remove(id);
    if (!data) throw new NotFoundException("Blog not found");
    return data;
  }

  async findBlogBySlug(slug: string) {
    const data = await this.blogRepo.findBlogBySlug(slug);
    if (!data) throw new NotFoundException("Blog not found");
    return data;
  }

  async findByCategorySlug(categorySlug: string) {
    const data = await this.blogRepo.findByCategorySlug(categorySlug);
    return data;
  }
}
