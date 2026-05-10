import {
    Tabs,
    Flex,
    Grid,
    GridItem,
    Heading,
} from "@chakra-ui/react";
import ProductCard from "../cards/ProductCard";
import SectionHeading from "./SectionHeading";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DataWrapper } from "@src/schema/schema";
import ProductRow from "@src/pages/Loadings/ProductRow";
import NotFoundSm from "@src/pages/NotFoundSm";
import type { ProductFilter, ProductSchema } from "@src/schema/product";
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_ENDPOINT}/api`;

export default function ProductsTab() {
    const [filter, setFilter] = useState<ProductFilter>("all");

    const { data, isLoading, isError } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["products", filter],
        queryFn: async ({ queryKey }) => {
            const [, activeFilter] = queryKey;
            const url = `${API_BASE_URL}/product/filter/${activeFilter}`;
            console.log(`Products fetch successful for ${activeFilter}:`, url);

            try {

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log(`Products fetch successful for ${activeFilter}:`, result);
                return result;
            } catch (err) {
                console.error(`Fetch error for ${activeFilter}:`, err);
                throw err;
            }
        },
        enabled: true,
    });

    const { data: newData } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["products", "new-check"],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/product/filter/new`);
            return response.json();
        }
    });

    const hasNewProducts = newData?.data && newData.data.length > 0;

    const products = data?.data || [];

    const tabs: { label: string; value: ProductFilter }[] = [
        { label: "All", value: "all" },
        { label: "Featured", value: "featured" },
        ...(hasNewProducts ? ([{ label: "New", value: "new" }] as const) : []),
        { label: "OnSale", value: "on_sale" as ProductFilter },
        { label: "Limited Stock", value: "limited_stock" as ProductFilter },
    ];

    return (
        <Flex
            flexDir={"column"}>
            <Tabs.Root
                value={filter}
                onValueChange={(details) => setFilter(details.value as ProductFilter)}
                width="100%">
                <SectionHeading title="Trendy Foods" />

                <Flex justify="center" mb="10">
                    <Tabs.List
                        justifyContent={"center"}
                        display="flex"
                        flexWrap="wrap"
                        borderBottom="none">
                        {tabs.map((tab) => (
                            <Tabs.Trigger
                                key={tab.value}
                                value={tab.value}
                                fontWeight="500"
                                fontSize="lg"
                                borderBottomWidth={{
                                    base: "none",
                                    md: "2"
                                }}
                                borderBottomColor={"transparent"}
                                _selected={{
                                    borderBottomColor: "primary.100",
                                    color: "primary.100",
                                    '[data-orientation="horizontal"] &': {
                                        "--indicator-color": "none",
                                    },
                                }}>
                                {tab.label}
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>
                </Flex>

                <Tabs.Content value={filter}>
                    {isLoading ? (
                        <ProductRow />
                    ) : isError ? (
                        <Flex
                            flexDir="column"
                            align="center"
                            gap={4}
                            py={10}>
                            <NotFoundSm />

                        </Flex>
                    ) : Array.isArray(products) && products.length > 0 ? (
                        <Grid
                            columnGap={{
                                base: "10",
                                md: "6",
                                lg: "8"
                            }}
                            rowGap={{
                                base: "10",
                                md: "12",
                                lg: "12"
                            }}
                            templateColumns={{
                                base: "repeat(1, 1fr)",
                                md: "repeat(3, 1fr)",
                                lg: "repeat(3, 1fr)",
                                xl: "repeat(4, 1fr)"
                            }}>
                            {products.slice(0, 8).map(item => (
                                <GridItem key={item.id}>
                                    <ProductCard product={item} />
                                </GridItem>
                            ))}
                        </Grid>
                    ) : (
                        <Flex
                            justifyContent="center"
                            py={10}>
                            <Heading
                                size="md"
                                color="gray.500">
                                No products found in this category.
                            </Heading>
                        </Flex>
                    )}
                </Tabs.Content>
            </Tabs.Root>
        </Flex>
    );
}
