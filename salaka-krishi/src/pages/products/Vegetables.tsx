import {
 Button,
Flex,
 Grid,
 Heading,
 Text
 } from "@chakra-ui/react";
import ProductCard from "@src/components/cards/ProductCard";
import ReviewCard from "@src/components/cards/review/ReviewCard";
import BreadCrumb from "@src/components/common/BreadCrumb";
import CustomContainer from "@src/components/common/CustomContainer";
import VegetableCategorySection from "@src/components/VegetablecategorySection";
import DealShowCaseCard from "@src/components/cards/DealShowCaseCard";
import ReviewFormModal from "@src/components/cards/review/ReviewFormModel";
import { useState } from "react";
import useIsVisible from "@src/utils/useIsVisible";
import { useQuery } from "@tanstack/react-query";
import type { DataWrapper } from "@src/schema/schema";
import type { ProductSchema } from "@src/schema/product";
import type { OverallReviewInterface } from "@src/schema/overallReviews";
import { useSearchParams } from "react-router";
import { getQueryFilterProducts } from "@src/api/products";
import { getOverallReviews } from "@src/api/overallReviews";

import NotFoundSm from "../NotFoundSm";
import { getBannersByTag } from "@src/api/banner";
import useNavigateToProductDetails from "@src/utils/useNavigateToProductDetails";
import { mapBannerData } from "@src/utils/banner";
import { getAccessToken } from "@src/utils/local-storage";
import { useAuthModalStore } from "@src/store/useAuthModalStore";
import { useUserStore } from "@src/store/useUserStore";
import { toaster } from "@src/components/ui/toaster";
import ProductRow from "../Loadings/ProductRow";
import ReviewLoading from "../Loadings/ReviewLoading";

export default function Vegetables() {
    const navigateToProductDetails = useNavigateToProductDetails();
    const baseImageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

    // 1. Fetch New Arrival Banner
    const { data: bannerResponse, isLoading: bannerLoading, isError: bannerError } = useQuery({
        queryKey: ["banners", "NewArrival"],
        queryFn: async () => {
            const res = await getBannersByTag("NewArrival") as any;
            return res.data;
        }
    });

    // Map Banner
    const bannersArray = Array.isArray(bannerResponse?.data) ? bannerResponse.data : [];
    const newArrivalBanner = bannersArray[0] as any;
    const mappedBannerData = mapBannerData(
        newArrivalBanner,
        navigateToProductDetails,
        baseImageUrl,
        "New Arrival"
    );

    const { isVisible, ref } = useIsVisible<HTMLDivElement>();
    const { openModal } = useAuthModalStore();
    const { userDetail } = useUserStore();

    const [searchParams] = useSearchParams();
    const filters: any = {};
    ["categories", "availability", "search"].forEach(key => {
        const val = searchParams.get(key);
        if (val) filters[key] = val.split(",");
    });

    // 2. Fetch Vegetables Products
    const { data, isLoading, isError } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["products", "vegetables", searchParams.toString()],
        enabled: !!isVisible,
        queryFn: async () => {
            const res = await getQueryFilterProducts({
                ...filters,
                categories: filters.categories?.length ? filters.categories : ["vegetables"]
            });
            return res.data;
        },
    });

    // 3. Fetch Overall Reviews
    const { data: reviewsData, isLoading: reviewsLoading, isError: reviewsError } = useQuery<DataWrapper<OverallReviewInterface[]>>({
        queryKey: ["overall-reviews"],
        queryFn: async () => {
            const res = await getOverallReviews();
            return res.data;
        },
    });

    const reviews = reviewsData?.data || [];
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [showAllProducts, setShowAllProducts] = useState(false);

    const hasAlreadyReviewed = reviews.some(review => review.createdById === userDetail?.id);

    const openReview = () => {
        if (!getAccessToken()) {
            openModal();
            return;
        }

        if (hasAlreadyReviewed) {
            toaster.create({
                title: "Already Reviewed",
                description: "You have already submitted an overall review.",
                type: "info",
            });
            return;
        }

        setIsReviewOpen(true);
    };
    const closeReview = () => setIsReviewOpen(false);

    const vegetableProducts = Array.isArray(data?.data) ? data.data : (data?.data as any)?.products || [];
    const visibleProducts = showAllProducts
        ? vegetableProducts
        : vegetableProducts.slice(0, 4);

    return (
        <>
            <CustomContainer py={12}>
                <Flex flexDir={"column"} gap={{ base: 12 }}>
                    <BreadCrumb />
                    {isLoading ? (
                        <ProductRow />
                    ) : isError ? (
                        <NotFoundSm />
                    ) : (
                        <Grid
                            ref={ref}
                            templateColumns={{
                                base: "repeat(1, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                                xl: "repeat(4, 1fr)"
                            }}
                            gap={{ base: 6, lg: 6 }}
                        >
                            {visibleProducts.map((product: ProductSchema) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </Grid>
                    )}
                    {vegetableProducts.length > 4 && (
                        <Button
                            alignSelf={"center"}
                            _hover={{ bgColor: "primary.300" }}
                            onClick={() => setShowAllProducts(!showAllProducts)}
                        >
                            {showAllProducts ? "View less" : "View More"}
                        </Button>
                    )}
                </Flex>
            </CustomContainer>

            {/* Banner Section */}
            {bannerLoading || bannerError || !mappedBannerData ? null : (
                <DealShowCaseCard data={mappedBannerData as any} />
            )}

            <CustomContainer py={12}>
                <Flex flexDir={"column"} gap={8}>
                    <VegetableCategorySection />
                    <Heading
                        fontFamily={"primary"}
                        color={"primary.100"}
                        fontSize={"2xl"}
                        fontWeight={"md"}>
                        Reviews
                    </Heading>
                    <Grid
                        templateColumns={{
                            base: "100%",
                            md: "repeat(2,1fr)"
                        }}
                        gap={{
                            base: 10,
                            lg: 12,
                            xl: 14
                        }}>
                        {reviewsLoading ? (
                            <ReviewLoading count={4} />
                        ) : (reviewsError || reviews.length === 0) ? (
                            <Text color="text.200" gridColumn="1 / -1">
                                No reviews yet. Be the first to add one!
                            </Text>
                        ) : (
                            reviews.slice(0, 4).map((person) => (
                                <ReviewCard
                                    key={person.id}
                                    person={{
                                        id: person.id,
                                        name: person.name,
                                        date: new Date(person.createdAt)
                                            .toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })
                                            .replace(/ /g, "-"),
                                        message: person.review,
                                        rating: person.rating,
                                    }}
                                />
                            ))
                        )}
                    </Grid>
                    <Flex justifyContent={"end"}>
                        <Button
                            onClick={openReview}
                            textDecoration={hasAlreadyReviewed ? "none" : "underline"}
                            fontSize={"xl"}
                            variant={"plain"}
                            disabled={hasAlreadyReviewed}
                            color={hasAlreadyReviewed ? "gray.400" : "primary.300"}
                            cursor={hasAlreadyReviewed ? "not-allowed" : "pointer"}
                            _hover={{ bg: "transparent" }}
                        >
                            {hasAlreadyReviewed ? "Already Reviewed" : "Add yours reviews"}
                        </Button>
                    </Flex>
                </Flex>
            </CustomContainer>

            <ReviewFormModal isOpen={isReviewOpen} onClose={closeReview} />
        </>
    );
}
