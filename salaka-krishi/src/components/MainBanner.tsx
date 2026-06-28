import {
    Flex,
    Heading,
    Button,
    Image,
} from "@chakra-ui/react";
import CustomContainer from "./common/CustomContainer";
import { useQuery } from "@tanstack/react-query";
import { getActiveHeroBanners } from "@src/api/heroBanner";
import { getCategories } from "@src/api/categories";
import { useNavigate } from "react-router";
import routes from "@src/router/routes";
import type { CategorySchema } from "@src/schema/categories";
import { getImageSrc } from "@src/utils/image";
import HeroBannerLoading from "@src/pages/Loadings/HeroBannerLoading";
import NotFoundSm from "@src/pages/NotFoundSm";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    dotsClass: "slick-dots custom-dot-list",
};

export default function MainBanner() {
    const navigate = useNavigate();
    const { data: bannersResponse, isLoading: isBannersLoading, isError: isBannersError } = useQuery({
        queryKey: ["activeHeroBanners"],
        queryFn: getActiveHeroBanners,
    });

    const { data: categoriesResponse } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories().then(res => res.data),
    });

    const banners = bannersResponse?.data?.data || [];
    const categories: CategorySchema[] = (categoriesResponse as any)?.data || [];

    if (isBannersLoading) {
        return (

             <HeroBannerLoading/>

        );
    }

    if (isBannersError || banners.length === 0) {
        return (
            <Flex
                width="full"
                height={{ base: "400px", md: "500px" }}
                justifyContent="center"
                alignItems="center"
                bg="gray.50"
                flexDir="column"
                gap={2}
            >
                <NotFoundSm />

            </Flex>
        );
    }

    const handleShopNow = (item: any) => {
        // Map from category slugs (from DB) to frontend route paths
        const categoryRouteMap: Record<string, string> = {
            "milk": routes.products.dairy,
            "dairy": routes.products.dairy,
            "khuwa": routes.products.dairy,
            "vegetables": routes.products.vegetables,
            "seasonal vegetables": routes.products.seasonalVegetables,
            "seasonalvegetables": routes.products.seasonalVegetables,
            "seasonal-vegetables": routes.products.seasonalVegetables,
            "vermicompost": routes.products.vermicompost,
        };

        // Prefer the category slug from the included relation
        const categorySlugFromBanner = item.category?.slug?.toLowerCase();
        const categoryNameFromBanner = item.category?.name?.toLowerCase();

        // Check route map with slug from banner's category relation first
        if (categorySlugFromBanner && categoryRouteMap[categorySlugFromBanner]) {
            navigate(`${routes.products.root}/${categoryRouteMap[categorySlugFromBanner]}`);
            return;
        }
        if (categoryNameFromBanner && categoryRouteMap[categoryNameFromBanner]) {
            navigate(`${routes.products.root}/${categoryRouteMap[categoryNameFromBanner]}`);
            return;
        }

        // Fallback: try to match categoryId against fetched categories list
        const categoryIdentifier = item.categoryId;
        if (!categoryIdentifier) return;

        const matchedCategory = categories.find(
            (cat) =>
                cat.name.toLowerCase() === categoryIdentifier.toLowerCase() ||
                cat.id === categoryIdentifier ||
                cat.slug === categoryIdentifier
        );

        const slug = matchedCategory?.slug?.toLowerCase() || categoryIdentifier.toLowerCase();
        const routePath = categoryRouteMap[slug]
            || categoryRouteMap[matchedCategory?.name?.toLowerCase() || ""];

        if (routePath) {
            navigate(`${routes.products.root}/${routePath}`);
        } else {
            navigate(`${routes.products.root}/${slug}`);
        }
    };

    return (
        <Flex
            flexDir={"column"}
            position="relative"
            width="full"
            overflow="hidden"
            className="carousel-container"
>
            <Slider {...settings}>
                {banners.map((item) => (
                    <Flex
                        key={item.id}
                        className="carousel-item"
                        w="100%"
                        h={{
                            base: "60vh",
                            md: "65vh",

                        }}
                        position="relative">
                        <Image
                            src={getImageSrc(item.imageUrl)}
                            w="100%"
                            h="100%"
                            objectFit="cover"/>

                        <Flex
                            zIndex={2}
                            position="absolute"
                            top={0}
                            left={0}
                            width="100%"
                            height="100%"
                            justify="center"
                            align="center"
                        >
                            <CustomContainer width={"100%"}>
                                <Flex
                                    width={{
                                        base: "100%",
                                        xl: "80%"
                                    }}
                                    mx={"auto"}
                                    flexDir="column"
                                    bg="secondary.200/50"
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    borderTopRightRadius={{
                                        base: "none",
                                        md: "100px"
                                    }}
                                    borderBottomLeftRadius={{
                                        base: "none",
                                        md: "100px"
                                    }}
                                    gap={6}
                                    py={12}
                                    px={6} >
                                    <Flex
                                        gap={4}
                                        flexDir={"column"}
                                        textAlign="center">
                                        <Heading as={"h3"}
                                            textStyle={"bannerSubTitle"}>
                                            {item.tagLine}
                                        </Heading>
                                        <Heading as={"h1"}
                                            textStyle={"bannerTitle"}>
                                            {item.title}
                                        </Heading>
                                    </Flex>
                                    <Button
                                        size="md"
                                        variant={"solid"}
                                        colorScheme={"green"}
                                        mt={6}
                                        onClick={() => handleShopNow(item)}
                                        _hover={{ bg: "primary.300" }}
                                    >
                                        SHOP NOW
                                    </Button>
                                </Flex>
                            </CustomContainer>
                        </Flex>
                    </Flex>
                ))}
            </Slider>
        </Flex>
    );
}
