import { Button, Flex, Grid } from "@chakra-ui/react";
import VermicompostCard from "./cards/VermicompostCard";
import CustomContainer from "./common/CustomContainer";
import { useState } from "react";
import useIsVisible from "@src/utils/useIsVisible";
import { useQuery } from "@tanstack/react-query";
import { getQueryFilterProducts } from "@src/api/products";
import ProductRow from "../pages/Loadings/ProductRow";
import NotFoundSm from "../pages/NotFoundSm";
import type { DataWrapper } from "@src/schema/schema";
import type { ProductSchema } from "@src/schema/product";
import { useSearchParams } from "react-router";


export default function VermicompostSection() {
    const { isVisible, ref } = useIsVisible<HTMLDivElement>();
    const [searchParams] = useSearchParams();
    const filters: any = {};
    ["categories", "availability", "search"].forEach(key => {
        const val = searchParams.get(key);
        if (val) filters[key] = val.split(",");
    });

    const { data, isLoading, isError } = useQuery<DataWrapper<ProductSchema[]>>({
        queryKey: ["products", "vermicompost", searchParams.toString()],
        enabled: !!isVisible,
        queryFn: async () => {
            const res = await getQueryFilterProducts({
                ...filters,
                categories: filters.categories?.length ? filters.categories : ["vermicompost"]
            });
            return res.data;
        },
    });






    const [showAllProducts, setShowAllProducts] = useState(false);

    const vermicompostProducts = Array.isArray(data?.data) ? data.data : (data?.data as any)?.products || [];
    const visibleProducts = showAllProducts
        ? vermicompostProducts : vermicompostProducts.slice(0, 4);


    return (
        <>

            <CustomContainer>
                {isLoading ? (
                    <ProductRow />
                ) : isError ? (
                    <NotFoundSm />
                ) : (
                    <Grid
                        ref={ref}
                        templateColumns={{
                            base: "repeat(1,1fr)",
                            md: "repeat(2,1fr)",
                            lg: "repeat(3,1fr)",
                            xl: "repeat(4,1fr)",
                        }}
                        gap={{
                            base: "12",
                            md: "6",
                            lg: "8",
                            xl: "12"
                        }}>
                        {visibleProducts.map((item: any) => (
                            <VermicompostCard
                                key={item.id}
                                data={item} />
                        ))}
                    </Grid>
                )}
                {vermicompostProducts.length > 4 && (
                    <Flex justifyContent={"center"} pb={10}>
                        <Button _hover={{
                            bgColor: "primary.300"
                        }}
                            onClick={() => setShowAllProducts(!showAllProducts)}
                        >
                            {showAllProducts ? "Viewless" : "View More"}
                        </Button>
                    </Flex>)}
            </CustomContainer>
        </>
    )
}
