// import { Flex } from "@chakra-ui/react";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
// import ProductCard from "./cards/ProductCard";
// import { ButtonGroup } from "./common/CustomArrow";
// import CustomContainer from "./common/CustomContainer";
// import { useQuery } from "@tanstack/react-query";
// import type { DataWrapper } from "@src/schema/schema";
// import { type ProductSchema } from "@src/schema/product";
// import { getQueryFilterProducts } from "@src/api/products";
// import { useSearchParams } from "react-router";
// import ProductRow from "@src/pages/Loadings/ProductRow";
// import NotFoundSm from "@src/pages/NotFoundSm";

// const responsive = {
//     superLargeDesktop: { breakpoint: { max: 4000, min: 1279 }, items: 4 },
//     desktop: { breakpoint: { max: 1279, min: 1023 }, items: 3 },
//     laptop: { breakpoint: { max: 1023, min: 767 }, items: 2 },
//     tablet: { breakpoint: { max: 767, min: 464 }, items: 2 },
//     mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
// };


// export default function ProductCarousel({ isVisible }: { isVisible: boolean }) {
//     const [searchParams] = useSearchParams();
//     const filters: any = {};
//     ["categories", "availability", "search"].forEach(key => {
//         const val = searchParams.get(key);
//         if (val) filters[key] = val.split(",");
//     });

//     const { data, isLoading, isError } = useQuery<DataWrapper<ProductSchema[]>>({
//         queryKey: ["products", "seasonal vegetables", isVisible, searchParams.toString()],
//         queryFn: async () => {
//             const res = await getQueryFilterProducts({
//                 ...filters,
//                 categories: filters.categories?.length ? filters.categories : ["seasonal-vegetables", "seasonalVegetables", "seasonal_vegetables"]
//             });
//             return res.data;
//         },
//         enabled: !!isVisible,
//     });

//     if (isLoading) return <ProductRow noOfRows={{ base: 1, md: 2, lg: 3, xl: 4 }} />;
//     if (isError) return <NotFoundSm />;

//     const products: ProductSchema[] = Array.isArray(data?.data) ? data.data : (data?.data as any)?.products ?? [];

//     return (
//         <Flex
//             flexDir="column"
//             position="relative"
//             width="100%">
//             <CustomContainer >
//                 <Carousel
//                     swipeable={true}
//                     draggable={true}
//                     autoPlay={true}
//                     centerMode={false}
//                     autoPlaySpeed={5000}
//                     customTransition="all 1.2s ease"
//                     arrows={false}
//                     itemClass="offer-carousel-item "
//                     renderButtonGroupOutside={true}
//                     customButtonGroup={<ButtonGroup />}
//                     responsive={responsive}>
//                     {products.map(product => (
//                         <ProductCard key={product.id} product={product} />
//                     ))}
//                 </Carousel>
//             </CustomContainer>

//         </Flex>
//     );
// }



import { Flex } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "./cards/ProductCard";
import { ButtonGroup } from "./common/CustomArrow";
import CustomContainer from "./common/CustomContainer";
import { useQuery } from "@tanstack/react-query";
import type { DataWrapper } from "@src/schema/schema";
import { type ProductSchema } from "@src/schema/product";
import { getQueryFilterProducts } from "@src/api/products";
import { useSearchParams } from "react-router";
import ProductRow from "@src/pages/Loadings/ProductRow";
import NotFoundSm from "@src/pages/NotFoundSm";
import { useRef } from "react";

const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1279,
            settings: { slidesToShow: 3 }
        },
        {
            breakpoint: 1023,
            settings: { slidesToShow: 2 }
        },
        {
            breakpoint: 767,
            settings: { slidesToShow: 2 }
        },
        {
            breakpoint: 464,
            settings: { slidesToShow: 1 }
        }
    ]
};


export default function ProductCarousel({ isVisible }: { isVisible: boolean }) {
    const sliderRef = useRef<Slider | null>(null);
    const [searchParams] = useSearchParams();
    const filters: any = {};
    ["categories", "availability", "search"].forEach(key => {
        const val = searchParams.get(key);
        if (val) filters[key] = val.split(",");
    });

    const { data, isLoading, isError } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["products", "seasonal vegetables", isVisible, searchParams.toString()],
        queryFn: async () => {
            const res = await getQueryFilterProducts({
                ...filters,
                categories: filters.categories?.length ? filters.categories : ["seasonal-vegetables", "seasonalVegetables", "seasonal_vegetables"]
            });
            return res.data;
        },
        enabled: !!isVisible,
    });

    if (isLoading) return <ProductRow noOfRows={{ base: 1, md: 2, lg: 3, xl: 4 }} />;
    if (isError) return <NotFoundSm />;

    const products: ProductSchema[] = Array.isArray(data?.data) ? data.data : (data?.data as any)?.products ?? [];

    return (
        <Flex
            flexDir="column"
            position="relative"
            width="100%">
            <CustomContainer >
                <Slider
                    ref={sliderRef}
                    {...settings}>
                    {products.map(product => (
                        <Flex key={product.id}
                            className="offer-carousel-item">
                            <ProductCard
                                product={product} />
                        </Flex>
                    ))}
                </Slider>
                <ButtonGroup
                    previous={() =>
                        sliderRef.current?.slickPrev()
                    }
                    next={() =>
                        sliderRef.current?.slickNext()
                    }
                />
            </CustomContainer>

        </Flex>
    );
}
