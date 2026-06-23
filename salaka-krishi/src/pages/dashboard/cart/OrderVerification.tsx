import {
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
    Text,
} from "@chakra-ui/react";

import CustomContainer from "@src/components/common/CustomContainer";
import ShippingDetails from "./ShippingDetails";
import TokenVerificationInput from "./components/TokenVerification";
import { useQuery } from "@tanstack/react-query";
import { getAccessToken } from "@src/utils/local-storage";
import type { CartInterface } from "@src/schema/schema";
import type { ProductSchema } from "@src/schema/product";
import ProductRow from "@src/pages/Loadings/ProductRow";
import NotFoundSm from "@src/pages/NotFoundSm";
import { useLocation, Navigate } from "react-router";
import routes from "@src/router/routes";
import { getImageSrc } from "@src/utils/image";
import { getCart, getCheckoutSummary } from "@src/api/cart";

export default function OrderVerification() {
    const { state } = useLocation();
    const currencyTypes = import.meta.env.VITE_CURRENCY_TYPE;
    const accessToken = getAccessToken();

    const { data, isLoading, isError } = useQuery<CartInterface<ProductSchema>>({
        queryKey: ['cart'],
        enabled: !!accessToken,
        queryFn: async () => {
            const res = await getCart();
            return res.data;
        }
    });

    const appliedCoupon = state.appliedCoupon;

    const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
        queryKey: ['checkout-summary', appliedCoupon?.code],
        enabled: !!accessToken,
        queryFn: async () => {
            const res = await getCheckoutSummary(appliedCoupon?.code);
            return res.data.data;
        }
    });


    if (!state || !state.shippingDetails) {
        return <Navigate to={routes.cart.cartCheckout} replace />;
    }

    if (isLoading || isSummaryLoading) return <ProductRow />;
    if (isError) return <NotFoundSm />;

    const cartData = data?.data;
    const products = cartData?.products || [];

    const summary = summaryData;
    const subTotal = summary?.subtotal || 0;
    const discountAmount = summary?.discount || 0;
    const deliveryCharge = summary?.deliveryCharge || 0;
    const finalTotal = summary?.total || 0;

    const COUPON_DISCOUNT = "Coupon Discount";
    const DELIVERY_CHARGE_LABEL = "Delivery Charge";
    const cartTableCalculation = [
        {
            id: 1,
            label: "Sub Total",
            value: `${currencyTypes} ${subTotal}`,
        },
        {
            id: 2,
            label: COUPON_DISCOUNT,
            value: `${currencyTypes} - ${discountAmount.toFixed(2)}`,
        },
        {
            id: 3,
            label: DELIVERY_CHARGE_LABEL,
            value: `${currencyTypes} ${deliveryCharge}`,
        },
        {
            id: 4,
            label: "Total",
            value: `${currencyTypes} ${finalTotal.toFixed(2)}`,
        },
    ]

    return (
        <>
            <CustomContainer py={20}>
                <Grid
                 

                    gap={{
                        base: 8,
                        lg: 0
                    }}
                    gridTemplateColumns={{
                        base: "100%",
                        xl: "46% 45%",
                        "2xl": "45% 45%",
                    }}
                    alignItems={"center"}
                    justifyContent={"space-around"}>

                    <GridItem
                        px={{
                            base: "10",
                            lg: "10",
                            xl: "4",
                            "2xl": "20",
                        }}
                        height={"fit-content"}
                        pos={{
                            lg: "sticky"
                        }}
                        top={10}
                        bg={"primary.300/10"} py={10} >
                        <Flex
                            flexDir={"column"}
                            gap={8}>
                            <Heading
                                textAlign={{
                                    base: "center",
                                    sm: "start",
                                }}
                                color={"primary.300"}
                                fontSize={"2xl"}
                                fontWeight={700}
                                as="h4">Your Order</Heading>

                            <Flex gap={10}
                                flexWrap="wrap"
                                justifyContent={{
                                    base: "center",
                                    sm: "start"
                                }}>
                                {products.map((item, index) => (
                                    <Flex

                                        key={index}
                                        width={{
                                            base: "100%",
                                            md: "132px"
                                        }}
                                        height={{
                                            base: "200px",
                                            md: "109px"
                                        }}
                                        aspectRatio={1}
                                        borderRadius={"14px"}
                                        borderWidth={1}
                                        overflow={"hidden"}
                                        borderColor={"background.300"}>
                                        <Image
                                            src={getImageSrc(item.product?.imageUrls?.[0])}
                                            alt={item.product?.name}
                                            h={"100%"}
                                            w={"100%"}
                                            objectFit={"cover"}
                                            objectPosition={"center"} />
                                    </Flex>

                                ))}
                            </Flex>

                            {appliedCoupon && <TokenVerificationInput
                                token={appliedCoupon.code} />}

                            <Flex flexDir={"column"} mt={4}>
                                {
                                    cartTableCalculation.map((item) => {
                                        const isCoupon = item.label === COUPON_DISCOUNT;
                                        const isTotal = item.label === "Total";
                                        return (
                                            <Flex

                                                key={item.id}
                                                justifyContent={"space-between"}
                                                alignItems={"center"}
                                                fontSize={"md"}
                                                borderTopWidth={isTotal ? 1 : 0}
                                                borderTopColor={"primary.100/50"}
                                                py={3} >
                                                <Text
                                                    color={isCoupon ? "border.300" : isTotal ? "Primary.300" : "primary.300"}
                                                    fontWeight={isTotal ? "700" : "500"}
                                                    fontSize={"md"}>{item.label}</Text>
                                                <Text
                                                    color={isCoupon ? "border.300" : isTotal ? "Primary.300" : "primary.300"}
                                                    fontWeight={isTotal ? "700" : "500"}
                                                    fontSize={"sm"}>{item.value}</Text>
                                            </Flex>
                                        )
                                    })}
                            </Flex>
                        </Flex>
                    </GridItem>
                    <GridItem>
                        <ShippingDetails
                            isReadOnly={true}
                            initialData={state.shippingDetails}
                            appliedCoupon={appliedCoupon}
                            isCartEmpty={products.length === 0}
                        />
                    </GridItem>
                </Grid >
            </CustomContainer >
        </>
    )
}
