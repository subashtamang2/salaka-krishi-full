import {
    Flex,
    Grid,
    GridItem,
    Heading,
} from "@chakra-ui/react";
import CustomContainer from "./common/CustomContainer";
import ProductListCategoryCard from "./cards/ProductListCategoryCard";
import { useQuery } from "@tanstack/react-query";
import { getQueryFilterProducts } from "@src/api/products";
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
                <ProductListLoad noOfRows={{ base: 1, md: 1, lg: 1, xl: 1 }} />
            ) : products.length > 0 ? (
                products.slice(0, 3).map((product) => (
                    <ProductListCategoryCard key={product.id} product={product} />
                ))
            ) : null}
        </Flex>
    );
}

export default function VegetableCategorySection() {
    const { data, isLoading, isError } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["vegetable-products-filtered"],
        queryFn: () => getQueryFilterProducts({ categories: ["vegetables", "seasonalVegetables"] }).then(res => res.data),
    });

    const allVegetableProducts = Array.isArray(data?.data) ? data.data : (data?.data as any)?.products || [];

    // Helper to filter and sort
    const getFilteredProducts = (filter: string) => {
        let products = [...allVegetableProducts];
        if (filter === "top_rated") {
            products = products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        } else if (filter === "best_selling") {
            products = products.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
        } else if (filter === "on_sale") {
            products = products.filter((p) => (p.discountPercentage ?? 0) > 0);
        }
        return products;
    };

    const topRated = getFilteredProducts("top_rated");
    const bestSelling = getFilteredProducts("best_selling");
    const onSale = getFilteredProducts("on_sale");

    const allEmpty = !isLoading && allVegetableProducts.length === 0;

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
                    <CategorySection 
                        title="Top Rated" 
                        products={topRated} 
                        isLoading={isLoading} 
                    />
                </GridItem>
                <GridItem>
                    <CategorySection 
                        title="Best Selling" 
                        products={bestSelling} 
                        isLoading={isLoading} 
                    />
                </GridItem>
                <GridItem >
                    <CategorySection 
                        title="On Sale" 
                        products={onSale} 
                        isLoading={isLoading} 
                    />
                </GridItem>
            </Grid>

            {!isLoading && (isError || allEmpty) && (
                <Flex justify="center" w="full" mt={10}>
                    <NotFoundSm />
                </Flex>
            )}
        </CustomContainer>
    )
}
