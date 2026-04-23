
export interface HeroBannerSchema {
    id: string;
    tagLine: string;
    title: string;
    description?: string;
    imageUrl: string;
    isActive: boolean;
    order?: number;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    categoryId?: string;
    createdAt: string;
    updatedAt: string;
}
