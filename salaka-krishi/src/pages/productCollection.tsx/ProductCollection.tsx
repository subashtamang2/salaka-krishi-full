import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    useDisclosure
} from "@chakra-ui/react";
import ProductCard from "@src/components/cards/ProductCard";
import { ButtonGroup } from "@src/components/common/CustomArrow";
import CustomContainer from "@src/components/common/CustomContainer";
import SectionHeading from "@src/components/common/SectionHeading";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import Filter from "./Filter";
import { useSearchParams } from "react-router";
import type { FilterParamsInterface } from "@src/schema/schema";
import { useMutation } from "@tanstack/react-query";
import { getQueryFilterProducts } from "@src/api/products";
import ProductRow from "../Loadings/ProductRow";
import NotFound from "../NotFound";
import type { ProductSchema } from "@src/schema/product";

export default function ProductCollection() {
    // const [postPerPage, setPostPerPage] = useState(12);
    const { open, onToggle } = useDisclosure();
    const [products, setProducts] = useState<ProductSchema[]>([]);

    const [filters, setFilters] = useState<FilterParamsInterface>({});
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const filterObj: (keyof FilterParamsInterface)[] = ["categories", "availability", "search"]
        const parsedFilters: FilterParamsInterface = {};


        filterObj.forEach(key => {
            const value = searchParams.get(key);
            if (value)
                parsedFilters[key] = value.split(',') as any;
        })
        setFilters(parsedFilters);
    }, [searchParams]);
    const { mutateAsync, isError, isSuccess } = useMutation({
        mutationFn: async (params: FilterParamsInterface) => {
            const res = await getQueryFilterProducts(params);
            return res.data;
        }
    });

    useEffect(() => {
        const timer = setTimeout(async () => {
            const result = await mutateAsync({ ...filters, limit: 50 }); // Fetch more products
            const responseData = result?.data;
            setProducts(Array.isArray(responseData) ? responseData : (responseData as any)?.products || []);
        }, 300);

        return () => clearTimeout(timer);
    }, [filters, mutateAsync]);


    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 1279 }, items: 4 },
        desktop: { breakpoint: { max: 1279, min: 1023 }, items: 3 },
        laptop: { breakpoint: { max: 1023, min: 767 }, items: 2 },
        tablet: { breakpoint: { max: 767, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    if (isError) return <NotFound title={"No Products Found"} />

    return (
        <>
            <CustomContainer
                bg="muted.200"
                pos={"relative"}
                py={12}>
                <Grid
                    pos="relative"
                    gap={4}
                    gridTemplateColumns={{
                        base: "100%",
                        md: "100%",
                        lg: "25% 75%",
                    }}>
                    <GridItem
                        height={"fit-content"}
                        bg={{ lg: "white" }}
                        rounded={"md"}
                        borderWidth={{ lg: 1 }}
                        px={{ lg: 4 }}
                        pos={{
                            lg: "sticky"
                        }}
                        left={0}
                        top={0}
                        maxHeight={"100vh"}
                        overflowY={"auto"}
                        borderColor="primary.100"
                        css={{
                            "&::-webkit-scrollbar": {
                                width: "2px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "secondary.400",
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "secondary.200",
                            }
                        }}>
                        <Button
                            display={{
                                base: "flex",
                                lg: "none"
                            }}
                            onClick={onToggle}
                        >Filter</Button>
                        <Filter
                            open={open}
                            onToggle={onToggle} />
                    </GridItem>

                    <GridItem
                        bg="white"
                        rounded={"md"}
                        borderWidth={1}
                        borderColor="green.100">


                        {
                            !isSuccess && <ProductRow />
                        }
                        <Grid
                            gap={4}
                            gridTemplateColumns={{
                                base: "repeat(1,1fr)",
                                sm: "repeat(2,1fr)",
                                lg: "repeat(2,1fr)",
                                xl: "repeat(3,1fr)",
                                "2xl": "repeat(4,1fr)",
                            }}
                            px={4} py={6}>
                            {
                                products.map(product => <GridItem key={product.id}><ProductCard product={product} /></GridItem>)
                            }
                        </Grid>
                    </GridItem>
                </Grid>
            </CustomContainer >
            <CustomContainer>
                <Flex
                    py={12}
                    w="full"
                    flexDir={"column"}
                    mb={8}>
                    <SectionHeading
                        title={"Recent View"} />
                    <Box
                        w="full"
                        position="relative">
                        <Carousel
                            swipeable={true}
                            draggable={true}
                            infinite={true}
                            autoPlay={false}
                            centerMode={false}
                            autoPlaySpeed={5000}
                            customTransition="all 1.2s ease"
                            arrows={false}
                            renderButtonGroupOutside={true}
                            customButtonGroup={<ButtonGroup />}
                            responsive={responsive}>
                            {
                                products.map(item => (
                                    <Box key={item.id} px={2}>
                                        <ProductCard product={item} />
                                    </Box>
                                ))
                            }
                        </Carousel>
                    </Box>
                </Flex>
            </CustomContainer >
        </>
    )
}
