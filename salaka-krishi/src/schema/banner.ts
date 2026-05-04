
export interface BannerSchema {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    slug: string;
    imageUrl: string;
    productId: string;
    tag?: "BestSelling" | "LimitedStock" | "NewArrival" | "BlackFriday";
    startDate?: string;
    endDate?: string;
}
