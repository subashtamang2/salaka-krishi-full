import {
    Button,
    Flex,
    Grid,
    Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@src/components/cards/ProductCard";
import BreadCrumb from "@src/components/common/BreadCrumb";
import CustomContainer from "@src/components/common/CustomContainer";
import MilkCategorySection from "@src/components/common/MilkCategorySection";
import DealShowCaseCard from "@src/components/cards/DealShowCaseCard";
import ReviewFormModal from "@src/components/cards/review/ReviewFormModel";
import { getBannersByTag } from "@src/api/banner";
import { useSearchParams } from "react-router";
import { getQueryFilterProducts } from "@src/api/products";
import type { ProductSchema } from "@src/schema/product";
import type { DataWrapper } from "@src/schema/schema";
import useNavigateToProductDetails from "@src/utils/useNavigateToProductDetails";
import ProductReviews from "./ProductReview";
import ProductRow from "../Loadings/ProductRow";
import { mapBannerData } from "@src/utils/banner";

export default function Dairy() {
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const navigateToProductDetails = useNavigateToProductDetails();
    const baseImageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

    const [searchParams] = useSearchParams();
    const filters: any = {};
    ["categories", "availability", "search"].forEach(key => {
        const val = searchParams.get(key);
        if (val) filters[key] = val.split(",");
    });

    // Fetch Milk Products
    const { data: productsResponse, isLoading: productsLoading } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["products", "milk", searchParams.toString()],
        queryFn: async () => {
            const res = await getQueryFilterProducts({
                ...filters,
                categories: filters.categories?.length ? filters.categories : ["milk", "dairy", "khuwa"]
            });
            return res.data;
        }
    });

    const milkProducts = Array.isArray(productsResponse?.data) ? productsResponse.data : (productsResponse?.data as any)?.products || [];
    const visibleProducts = showAllProducts ? milkProducts : milkProducts.slice(0, 4);

    // Fetch Best Selling Banner
    const { data: bannerResponse, isLoading: bannerLoading, isError: bannerError } = useQuery({
        queryKey: ["banners", "BestSelling"],
        queryFn: async () => (await getBannersByTag("BestSelling") as any).data
    });
    const bestSellingBanner = Array.isArray(bannerResponse?.data) ? bannerResponse.data[0] : null;
    const mappedBannerData = mapBannerData(bestSellingBanner, navigateToProductDetails, baseImageUrl, "Best Selling");

    const closeReview = () => setIsReviewOpen(false);


    return (
        <>
            <CustomContainer py={10}>
                <Flex flexDir="column" gap={12}>
                    <BreadCrumb />
                    {productsLoading ? <ProductRow /> : (
                        <Grid
                            templateColumns={{
                                base: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                                xl: "repeat(4, 1fr)"
                            }}
                            gap={{ base: 6, lg: 8 }}>
                            {visibleProducts.map((product: ProductSchema) => <ProductCard
                                key={product.id}
                                product={product} />)}
                        </Grid>
                    )}
                    {milkProducts.length > 4 && (
                        <Button
                            alignSelf="center"
                            _hover={{
                                bgColor: "primary.300"
                            }} onClick={() => setShowAllProducts(!showAllProducts)}>
                            {showAllProducts ? "View Less" : "View More"}
                        </Button>
                    )}
                </Flex>
            </CustomContainer>



            {bannerLoading || bannerError || !mappedBannerData ? null : (
                <DealShowCaseCard data={mappedBannerData as any} />
            )}



            <CustomContainer py={12}>
                <Flex flexDir="column" gap={8}>
                    <MilkCategorySection />
                    <Heading
                        color="primary.100"
                        fontSize="2xl"
                        fontWeight="md">
                        Reviews
                    </Heading>
                    <Grid
                        templateColumns={{
                            base: "repeat(1,1fr)",
                            md: "repeat(2,1fr)"
                        }}
                        gap={14}>
                        <ProductReviews
                            products={milkProducts}
                        />
                    </Grid>
                </Flex>
            </CustomContainer>

            <ReviewFormModal
                isOpen={isReviewOpen}
                onClose={closeReview} />
        </>
    );
}
