import { Flex, GridItem, Heading } from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";
import video from "@assets/video/salaka.mp4";
import VideoBanner from "@src/components/VideoBanner";
import DealShowCaseCard from "@src/components/cards/DealShowCaseCard";
import { brandCardsData } from "@src/data/BrandCards";
import BrandCard from "@src/components/cards/BrandCard";
import BreadCrumb from "@src/components/common/BreadCrumb";
import ProductCarousel from "@src/components/ProductCarousel";
import useIsVisible from "@src/utils/useIsVisible";
import { useQuery } from "@tanstack/react-query";
import { getBannersByTag } from "@src/api/banner";
import useNavigateToProductDetails from "@src/utils/useNavigateToProductDetails";




export default function SeasonalVegetables() {
    const { isVisible, ref } = useIsVisible<HTMLDivElement>();
    const baseImageUrl = import.meta.env.VITE_IMAGE_BASE_URL;
    const navigateToProductDetails = useNavigateToProductDetails();


    // 1. Fetch Limited stock Banners using React Query
    const { data: bannerResponse, isLoading: bannerLoading, isError: bannerError } = useQuery({
        queryKey: ["banners", "LimitedStock"],
        queryFn: async () => {
            const res = await getBannersByTag("LimitedStock") as any;
            return res.data;
        }
    })

    // process Banner
    const bannersArray = Array.isArray(bannerResponse?.data) ? bannerResponse.data : [];
    const limitdStockBanner = bannersArray[0] as any;

    const normalizeUrl = (url?: string): string => {
        if (!url) return "";
        return url.startsWith("http") ? url : `${baseImageUrl}/${url}`
    };

    const now = new Date();
    const isBannerActive = limitdStockBanner &&
        (!limitdStockBanner.startDate || new Date(limitdStockBanner.startDate) <= now) &&
        (!limitdStockBanner.endDate || new Date(limitdStockBanner.endDate) >= now);

    const mappedBannerData = isBannerActive ? {
        title: limitdStockBanner.title,
        subTitle: limitdStockBanner.subtitle || "Limited Stock",
        description: limitdStockBanner.product?.description || limitdStockBanner.description || "",
        buttonLink: () => {
            const targetId = limitdStockBanner.product?.id || limitdStockBanner.productId;
            if (targetId) navigateToProductDetails(targetId);
        },
        images: [
            {
                url: normalizeUrl(limitdStockBanner.product?.imageUrl || limitdStockBanner.imageUrl),
                title: limitdStockBanner.title
            }
        ]
    } : null;




    return (
        <>
            <Flex flexDir={"column"}
                bg={"background.300/6"}
>

                <Flex flexDir={"column"}  >
                    <CustomContainer
                        py={6}>
                        <BreadCrumb />
                        <Flex flexDir={"column"} gap={20} py={20}>
                            <Heading
                                ref={ref}
                                textAlign={"center"}
                                color={"primary.100"}
                                fontWeight={700}
                                fontSize={{
                                    base: "2xl",
                                    md: "3xl"
                                }}>
                                Seasonal Vegetables this Month
                            </Heading>
                            <ProductCarousel isVisible={isVisible} />
                        </Flex>
                    </CustomContainer>
                    {/* Banner Section */}
                    {bannerLoading || bannerError || !mappedBannerData ? (
                        null
                    ) : (
                        <DealShowCaseCard
                            data={mappedBannerData as any} />

                    )}

                </Flex>
                <VideoBanner
                    title="The place from where our
                           products comes !"
                    backgroundVideo={video} />
                <CustomContainer py={16}>

                    <Flex
                        padding={2}
                        flexWrap={"wrap"}
                        justifyContent={{
                            base: "center",
                            xl: "space-between"
                        }}

                        borderWidth={{
                            base: 0,
                            lg: 1,
                        }}
                        borderTopRightRadius={"30px"}
                        borderBottomLeftRadius={"30px"}
                        borderColor={"primary.100"}
                        gap={{
                            base: "8",
                            lg: "4"
                        }}>
                        {brandCardsData.map((item) => (
                            <GridItem key={item.id}>
                                <BrandCard data={item} />
                            </GridItem>))}
                    </Flex>
                </CustomContainer>
            </Flex>
        </>
    )
}
