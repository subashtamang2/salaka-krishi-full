import Carousel from "react-multi-carousel";
import OfferCard from "./cards/OfferCard";
import { useQuery } from "@tanstack/react-query";
import type { ProductSchema } from "@src/schema/product";
import type { DataWrapper } from "@src/schema/schema";
import { getProductByFilter } from "@src/api/products";
import ProductRow from "@src/pages/Loadings/ProductRow";
import NotFoundSm from "@src/pages/NotFoundSm";

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

export default function OfferCarousel() {
    const { data, isLoading, isError } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["products", "on_sale"],
        queryFn: () => getProductByFilter("on_sale").then(res => res.data)
    });

    const products = data?.data || [];
    if (isLoading) return <ProductRow />
    if (isError) return <NotFoundSm />;
    return (
        <Carousel
            responsive={responsive}
            autoPlay
            autoPlaySpeed={5000}
            infinite
            arrows={false}
            showDots
            containerClass="carousel-container"
            dotListClass="offer-carousel-dots"
            itemClass="carousel-item">
            {products.map((product, index) => {
                const nextProduct = products[(index + 1) % products.length];
                return (
                    <OfferCard
                        key={product.id}
                        product={product}
                        nextProduct={nextProduct}
                    />
                );
            })}
        </Carousel>
    );
}
