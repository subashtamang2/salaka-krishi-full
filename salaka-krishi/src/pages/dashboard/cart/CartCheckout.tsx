import {
    Flex,
    Grid,
    GridItem,
    Heading,
    Text,
} from "@chakra-ui/react";

import CustomContainer from "@src/components/common/CustomContainer";
import CouponBox from "./components/CouponBox";
import ShippingDetails from "./ShippingDetails";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@src/api/cart";
import { getAccessToken } from "@src/utils/local-storage";
import type { CartInterface } from "@src/schema/schema";
import type { ProductSchema } from "@src/schema/product";
import ProductRow from "@src/pages/Loadings/ProductRow";
import NotFoundSm from "@src/pages/NotFoundSm";
import OrderCart from "./OrderCart";
import { useState } from "react";
import EmptyCart from "./components/EmptyCart";

export default function CartCheckout() {
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
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



    if (isLoading) return <ProductRow />;
    if (isError) return <NotFoundSm />;

    const cartData = data?.data;
    const products = cartData?.products || [];
    const subTotal = cartData?.totalAmount || 0;
    const DELIVERY_CHARGE = 10;
    const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
    const finalTotal = subTotal - discountAmount + DELIVERY_CHARGE;

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
            value: `${currencyTypes} ${DELIVERY_CHARGE}`,
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
                {products.length === 0 ? (
                    <EmptyCart />
                ) : (
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
                                    as="h4">Cart Item</Heading>

                                <Flex flexDir="column" gap={2}>
                                    {products.map((item, index) => (
                                        <OrderCart key={index} product={item} />
                                    ))}
                                </Flex>

                                <CouponBox
                                    totalAmount={subTotal}
                                    onApply={(coupon) => setAppliedCoupon(coupon)}
                                />

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
                                                    borderTopWidth={1}
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
                                appliedCoupon={appliedCoupon}
                            />
                        </GridItem>
                    </Grid >
                )}
            </CustomContainer >
        </>
    )
}
