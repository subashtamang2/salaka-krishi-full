import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import DealShowCaseCard from "../cards/DealShowCaseCard";
import { getBannersByTag } from "@src/api/banner";

interface BannerSectionProps {
    tag: string;
}
export default function BannerSection({ tag }: BannerSectionProps) {
    const navigate = useNavigate();

    // React Query: fetch banners by tag
    const { data, isLoading, isError } = useQuery({
        queryKey: ['banners', tag],
        queryFn: () => getBannersByTag(tag).then(res => res.data)
    });

    const banners = (data as any) || [];


    if (isLoading) return null;
    if (isError || banners.length === 0) return null;

    const banner = banners[0];

    const now = new Date();
    if (banner.startDate && new Date(banner.startDate) > now) return null;
    if (banner.endDate && new Date(banner.endDate) < now) return null;

    const bannerData = {
        title: banner.product?.name || banner.title,
        subTitle: banner.subtitle || "Best Seller",
        description: banner.description || "",
        buttonLink: banner.product
            ? () => navigate(`/product/${banner.productId}`)
            : "Shop Now",
        images: [
            { url: banner.product?.imageUrl || banner.imageUrl, title: banner.product?.name || banner.title }
        ]
    };

    return <DealShowCaseCard data={bannerData} />;
}
