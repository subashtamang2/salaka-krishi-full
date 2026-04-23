import { Expose, Type } from "class-transformer";
import { IsBoolean, IsString, IsUUID } from "class-validator";

export class GalleryResponse {
    @IsUUID()
    @Expose()
    id: string;

    @Expose()
    @IsString()
    imageUrl: string;

    @Expose()
    @IsString()
    title: string;

    @Expose()
    @IsBoolean()
    isPublished: boolean;

    @Expose()
    createdAt: boolean;

    @Expose()
    updatedAt: Date;
}
export class PaginatedGalleryResponse {
    @Expose()
    total_images: number;

    @Expose()
    images_per_page: number;

    @Expose()
    @Type(() => GalleryResponse)
    galleries: GalleryResponse[];
}
