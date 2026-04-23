import {
    Flex,
    Grid,
    GridItem,
    Heading,
    Text,
    Spinner
} from "@chakra-ui/react";
import CustomContainer from "./common/CustomContainer";
import ProductListCategoryCard from "./cards/ProductListCategoryCard";
import { useQuery } from "@tanstack/react-query";
import { getQueryFilterProducts } from "@src/api/products";
import type { ProductSchema } from "@src/schema/product";
import type { DataWrapper } from "@src/schema/schema";

interface CategorySectionProps {
    title: string;
    filter: "top_rated" | "best_selling" | "on_sale";
}

function CategorySection({ title, filter }: CategorySectionProps) {
    const { data, isLoading, isError } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["vegetable-products-filtered"],
        queryFn: () => getQueryFilterProducts({ categories: ["vegetables", "seasonalVegetables"] }).then(res => res.data),
    });

    const allVegetableProducts = Array.isArray(data?.data) ? data.data : (data?.data as any)?.products || [];

    // Filter and sort based on the section type
    let products = [...allVegetableProducts];
    if (filter === "top_rated") {
        products = products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (filter === "best_selling") {
        products = products.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
    } else if (filter === "on_sale") {
        products = products.filter((p) => (p.discountPercentage ?? 0) > 0);
    }

    return (
        <Flex flexDir={"column"} gap={4}>
            <Flex flexDir={"column"} gap={2}>
                <Heading
                    fontSize={"2xl"}
                    fontWeight={700}
                    fontFamily={"primary"}
                    color={"secondary.100"}>
                    {title}
                </Heading>
                <Flex
                    width={"10%"}
                    borderWidth={1}
                    borderColor={"primary.100"} />
            </Flex>
            {isLoading ? (
                <Flex justify="center" py={4}>
                    <Spinner color="primary.100" />
                </Flex>
            ) : isError ? (
                <Text color="red.500">Failed to load {title.toLowerCase()} products</Text>
            ) : products.length > 0 ? (
                products.slice(0, 3).map((product) => (
                    <ProductListCategoryCard key={product.id} product={product} />
                ))
            ) : (
                <Text color="gray.500">No products found</Text>
            )}
        </Flex>
    );
}

export default function VegetableCategorySection() {
    return (
        <CustomContainer mb={16}>
            <Grid templateColumns={{
                base: "repeat(1,1fr)",
                sm: "repeat(2,1fr)",
                lg: "repeat(3,1fr)",
            }}
                gap={{
                    base: 14,
                    lg: 8
                }} >
                <GridItem >
                    <CategorySection title="Top Rated" filter="top_rated" />
                </GridItem>
                <GridItem>
                    <CategorySection title="Best Selling" filter="best_selling" />
                </GridItem>
                <GridItem >
                    <CategorySection title="On Sale" filter="on_sale" />
                </GridItem>
            </Grid>
        </CustomContainer>
    )
}
