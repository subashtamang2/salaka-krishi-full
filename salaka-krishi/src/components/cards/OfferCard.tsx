import { Flex, Grid, Heading, Image, Text } from "@chakra-ui/react"
import CustomContainer from "../common/CustomContainer";
import ProgressStatus from "@src/components/cards/ProgressStatus";
import CalculateRemainingTime from "@src/utils/CalculateRemainingTIme";
import { useState, useEffect } from "react";
import useNavigateToProductDetails from "@src/utils/useNavigateToProductDetails";
import { getImageSrc } from "@src/utils/image";

import type { ProductSchema } from "@src/schema/product";


interface StateInterface {
    days: number,
    hours: number,
    min: number,
    sec: number
}

interface OfferCardProps {
    product: ProductSchema;
    nextProduct?: ProductSchema;
}

export default function OfferCard({ product, nextProduct }: OfferCardProps) {
    const navigateToProductDetails = useNavigateToProductDetails();
    const [offer, setOffer] = useState<StateInterface>({
        days: 0,
        hours: 0,
        min: 0,
        sec: 0,
    })

    // Use discountEndDate from product or fallback to a default
    const date = product.discountEndDate || "2026-08-04T10:42:10.123Z"

    useEffect(() => {
        const interval = setInterval(() => {
            const { days, hours, min, sec } = CalculateRemainingTime(date)
            setOffer({
                days,
                hours,
                min,
                sec
            })
        }, 1000);
        return () => clearInterval(interval);
    }, [date]);

    return (
        <>
            <CustomContainer >
                <Grid templateColumns={{
                    base: "1fr",
                    md: "1fr",
                    lg: "30% 48% 20%"
                }}
                    bg={"secondary.200"}
                    gap={4}
                    borderColor={"primary.100"}
                    borderTopRightRadius="40px"
                    borderBottomLeftRadius="40px"
                    padding={6}
                    shadow={"lg"}
                    borderWidth={1}>

                    <Flex
                        position={"relative"}
                        flexDir="column"
                        overflow="hidden"
                        borderTopRightRadius="30px"
                        borderBottomLeftRadius="30px"
                        height="312px"
                        cursor="pointer"
                        onClick={() => navigateToProductDetails(product.slug)}
                        width={{
                            base: "100%",
                            md: "275px",
                        }}>
                        <Image
                            src={getImageSrc(product?.imageUrls?.[0])}
                            alt={product.name}
                            height={"100%"}
                            width={"100%"}
                            objectFit={"cover"}
                            objectPosition={"top"} />
                        <Text
                            color="secondary.200"
                            bg="primary.100"
                            position="absolute"
                            top={0}
                            left={0}
                            px={8}
                            py={2}
                            fontSize={"sm"}
                            fontWeight={600}
                            zIndex={2}>
                            {product.discountPercentage}% OFF
                        </Text>
                    </Flex>

                    <Flex
                        flexDir={"column"}
                        gap={6}>
                        <Heading
                            color={"secondary.100"}
                            fontSize={"4xl"}
                            cursor="pointer"
                            onClick={() => navigateToProductDetails(product.slug)}
                            fontWeight={400}>
                            {product.name}
                        </Heading>
                        <Flex

                            gap={6}
                            fontSize={"xl"}
                            fontWeight={500}>
                            <Text
                                color={"primary.100"}>
                                Rs.{product.price - (product.price * (product.discountPercentage || 0) / 100)}</Text>
                            {product.discountPercentage && (
                                <Text
                                    color={"text.200"}
                                    textDecoration={"line-through"}>
                                    Rs.{product.price}</Text>
                            )}
                        </Flex>
                        <ProgressStatus available={product.stock ?? 0} sold={product.sold ?? 0} />
                        <Grid templateColumns={{
                            base: "repeat(4,1fr)"
                        }}

                            width={"30%"}
                            gap={4} >
                            <Flex
                                flexDir={"column"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                height={"59px"}
                                width={"59px"}
                                bg={"primary.100"}>
                                <Text

                                    fontWeight={600}
                                    color={"secondary.200"}>
                                    {offer.days}
                                </Text>
                                <Text
                                    textTransform={"uppercase"}
                                    color={"secondary.200"}
                                    fontWeight={600}>days</Text>
                            </Flex>

                            <Flex
                                flexDir={"column"}
                                justifyContent={"center"}
                                alignItems={"center"} height={"59px"}
                                width={"59px"}
                                bg={"primary.100"}>
                                <Text
                                    fontWeight={600}
                                    color={"secondary.200"}>
                                    {offer.hours}
                                </Text>
                                <Text
                                    textTransform={"uppercase"}
                                    color={"secondary.200"}
                                    fontWeight={600}>hr</Text>
                            </Flex>
                            <Flex
                                flexDir={"column"}
                                justifyContent={"center"}
                                alignItems={"center"} height={"59px"}
                                width={"59px"}
                                bg={"primary.100"}>
                                <Text
                                    fontWeight={600}
                                    color={"secondary.200"}>
                                    {offer.min}
                                </Text>
                                <Text
                                    textTransform={"uppercase"}
                                    color={"secondary.200"}
                                    fontWeight={600}>min</Text>
                            </Flex>
                            <Flex
                                flexDir={"column"}
                                justifyContent={"center"}
                                alignItems={"center"} height={"59px"}
                                width={"59px"}
                                bg={"primary.100"}>
                                <Text
                                    fontWeight={600}
                                    color={"secondary.200"}>
                                    {offer.sec}
                                </Text>
                                <Text
                                    color={"secondary.200"}
                                    textTransform={"uppercase"}
                                    fontWeight={600}>sec</Text>
                            </Flex>
                        </Grid>
                    </Flex>
                    <Flex
                        flexDir={{
                            base: "row",
                            md: "column"
                        }}
                        gap={4}>
                        <Flex
                            flexDir="column"
                            overflow="hidden"
                            borderTopRightRadius="30px"
                            borderBottomLeftRadius="30px"
                            height="148px"
                            width="131px">
                            <Image
                                src={getImageSrc(product?.imageUrls?.[0])}
                                alt={product.name}
                                height={"100%"}
                                width={"100%"}
                                objectFit={"cover"}
                                objectPosition={"top"} />
                        </Flex>
                        <Flex
                            flexDir="column"
                            overflow="hidden"
                            borderTopRightRadius="30px"
                            borderBottomLeftRadius="30px"
                            height="148px"
                            position={"relative"}
                            width="131px"
                            cursor="not-allowed">
                            <Image
                                src={getImageSrc(nextProduct?.imageUrls?.[0])}
                                alt={nextProduct?.name || "Next Product"}
                                height={"100%"}
                                width={"100%"}
                                objectFit={"cover"}
                                objectPosition={"top"}
                                opacity={0.5}
                                pointerEvents="none"
                                filter="grayscale(100%)" />
                        </Flex>
                    </Flex>

                </Grid>
            </CustomContainer>


        </>
    )
}
