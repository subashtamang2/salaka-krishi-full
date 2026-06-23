import {
    Flex,
    Grid,
    GridItem,
    Heading,
} from "@chakra-ui/react";
import ProductListCategoryCard from "./cards/ProductListCategoryCard";
import CustomContainer from "./common/CustomContainer";
import { useQuery } from "@tanstack/react-query";
import { getProductByFilter } from "@src/api/products";
import type { ProductSchema } from "@src/schema/product";
import type { DataWrapper } from "@src/schema/schema";
import ProductListLoad from "@src/pages/Loadings/ProductListLoad";
import NotFoundSm from "@src/pages/NotFoundSm";

interface CategorySectionProps {
    title: string;
    products: ProductSchema[];
    isLoading: boolean;
}

function CategorySection({ title, products, isLoading }: CategorySectionProps) {
    return (
        <Flex flexDir={"column"} gap={4}>
            <Flex flexDir={"column"} gap={2}>
                <Heading
                    fontSize={"2xl"}
                    fontWeight={700}
                    color={"secondary.100"}>
                    {title}
                </Heading>
                <Flex
                    width={"10%"}
                    borderWidth={1}
                    borderColor={"primary.100"}
                />
            </Flex>

            {isLoading ? (
                <ProductListLoad noOfRows={{ base: 1, md: 1, lg: 1, xl: 1 }} />
            ) : products.length > 0 ? (
                products.slice(0, 3).map((product) => (
                    <ProductListCategoryCard key={product.id} product={product} />
                ))
            ) : null}
        </Flex>
    );
}

export default function ProductListCategory() {
    const { data: topRatedData, isLoading: isTopRatedLoading, isError: isTopRatedError } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["products", "top_rated"],
        queryFn: () => getProductByFilter("top_rated").then(res => res.data),
    });

    const { data: bestSellingData, isLoading: isBestSellingLoading, isError: isBestSellingError } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["products", "best_selling"],
        queryFn: () => getProductByFilter("best_selling").then(res => res.data),
    });

    const { data: onSaleData, isLoading: isOnSaleLoading, isError: isOnSaleError } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["products", "on_sale"],
        queryFn: () => getProductByFilter("on_sale").then(res => res.data),
    });

    const topRated = topRatedData?.data || [];
    const bestSelling = bestSellingData?.data || [];
    const onSale = onSaleData?.data || [];


    const isCombinedLoading = isTopRatedLoading || isBestSellingLoading || isOnSaleLoading;

    const anyError = isTopRatedError || isBestSellingError || isOnSaleError;
    const allEmpty = !isCombinedLoading && topRated.length === 0 && bestSelling.length === 0 && onSale.length === 0;

    return (
        <CustomContainer py={16}>
            <Grid
                templateColumns={{
                    base: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                }}
                gap={{
                    base: 14,
                    lg: 8,
                }}
            >
                <GridItem>
                    <CategorySection
                        title="Top Rated"
                        products={topRated}
                        isLoading={isCombinedLoading}
                    />
                </GridItem>
                <GridItem>
                    <CategorySection
                        title="Best Selling"
                        products={bestSelling}
                        isLoading={isCombinedLoading}
                    />
                </GridItem>
                <GridItem>
                    <CategorySection
                        title="On Sale"
                        products={onSale}
                        isLoading={isCombinedLoading}
                    />
                </GridItem>
            </Grid>

            {!isCombinedLoading && (anyError || allEmpty) && (
                <Flex flexDir="column" align="center" gap={4} py={10} width="full">
                    <NotFoundSm />
                </Flex>
            )}
        </CustomContainer>
    );
}
