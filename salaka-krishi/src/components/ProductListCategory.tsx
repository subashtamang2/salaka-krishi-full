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
import NotFound from "@src/pages/NotFound";

interface CategorySectionProps {
    title: string;
    filter: "top_rated" | "best_selling" | "on_sale";
}

function CategorySection({ title, filter }: CategorySectionProps) {
    const { data, isLoading, isError } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["products", filter],
        queryFn: () => getProductByFilter(filter).then(res => res.data),
    });

    const products = data?.data || [];

    if (isError) return <NotFound title="Product Not Found" />;
    if (isLoading) return <ProductListLoad />;

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

            {products.length > 0 ? (
                products.slice(0, 3).map((product) => (
                    <ProductListCategoryCard key={product.id} product={product} />
                ))
            ) : (
                <NotFound title="Product NotFound "/>
            )}
        </Flex>
    );
}

export default function ProductListCategory() {
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
                    <CategorySection title="Top Rated" filter="top_rated" />
                </GridItem>
                <GridItem>
                    <CategorySection title="Best Selling" filter="best_selling" />
                </GridItem>
                <GridItem>
                    <CategorySection title="On Sale" filter="on_sale" />
                </GridItem>
            </Grid>
        </CustomContainer>
    );
}
