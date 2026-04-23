import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class CategoryResponse {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    slug: string;

    @Expose()
    imageUrl: string;
}

export class BlogReponse {
    @IsUUID()
    @Expose()
    id: string;

    @Expose()
    @IsString()
    title: string;

    @Expose()
    @IsString()
    slug: string;

    @Expose()
    @IsString()
    shortDesc: string;

    @Expose()
    @IsString()
    content: string;

    @Expose()
    @Type(() => CategoryResponse)
    category: CategoryResponse;

    @Expose()
    categoryId: string;

    @Expose()
    @IsString()
    imageUrl: string;

    @Expose()
    @IsBoolean()
    isPublished: boolean;

    @Expose()
    keywords: string[];

    @Expose()
    @IsString()
    author: string;

    @Expose()
    @IsString()
    comment: string[];

    @Expose()
    @IsString()
    createdAt: Date;

    @Expose()
    @IsString()
    updatedAt: Date;

    @Expose()
    _count: string;
}

export class PaginatedBlogResponse {
    @Expose()
    total_no_of_post: number;
    @Expose()
    post_per_page: number;
    @Expose()
    @Type(() => BlogReponse)
    blogs: BlogReponse[];
}
