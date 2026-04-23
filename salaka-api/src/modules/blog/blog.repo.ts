import { PrismaService } from "src/prisma/prisma.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { Injectable } from "@nestjs/common";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BlogRepo {
  private noOfPostsPerPage: number;
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {
    this.noOfPostsPerPage = this.config.get<number>("pagination.pageSize")!;
  }
  findBlogBySlug(slug: string) {
    return this.prisma.blog.findUnique({
      where: { slug },
      include: { category: true },
    });
  }

  create(data: CreateBlogDto, authorId: string) {
    const { categoryId, ...rest } = data;
    return this.prisma.blog.create({
      data: {
        ...rest,
        author: {
          connect: { id: authorId },
        },
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      },
      include: { category: true },
    });
  }

  findPublishedBlog(pageNumber?: number, limit?: number) {
    const noOfPostsPerPage = limit ? limit : this.noOfPostsPerPage;
    return this.prisma.$transaction([
      this.prisma.blog.count({
        where: { isPublished: true },
      }),
      this.prisma.blog.findMany({
        where: { isPublished: true },
        take: pageNumber ? noOfPostsPerPage * pageNumber : noOfPostsPerPage,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: true,
          _count: {
            select: { comment: true },
          },
        },
      }),
    ]);
  }

  findCurrentUserBlog(id: string) {
    return this.prisma.blog.findMany({
      where: { authorId: id },
      orderBy: {
        createdAt: "desc",
      },
      include: { category: true },
    });
  }

  findAll() {
    return this.prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: { category: true },
    });
  }

  findOne(id: string) {
    return this.prisma.blog.findUnique({
      where: { id, isPublished: true },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileUrl: true,
          },
        },
        comment: {
          select: {
            id: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileUrl: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    const { categoryId, ...rest } = updateBlogDto;
    return this.prisma.blog.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId !== undefined
          ? categoryId
            ? { category: { connect: { id: categoryId } } }
            : { category: { disconnect: true } }
          : {}),
      },
      include: { category: true },
    });
  }

  remove(id: string) {
    return this.prisma.blog.delete({
      where: { id },
      include: { category: true },
    });
  }

  findByCategorySlug(categorySlug: string) {
    return this.prisma.blog.findMany({
      where: {
        isPublished: true,
        category: {
          slug: categorySlug,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        _count: {
          select: { comment: true },
        },
      },
    });
  }
}
