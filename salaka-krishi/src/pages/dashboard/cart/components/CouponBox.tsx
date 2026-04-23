import {
    Alert,
    Box,
    Button,
    Flex,
    Input,
    Text
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { validateCoupon } from "@src/api/coupon";
import { toaster } from "@src/components/ui/toaster";

interface CouponBoxProps {
    onApply?: (coupon: any) => void;
    totalAmount: number;
}

export default function CouponBox({ onApply, totalAmount }: CouponBoxProps) {
    const [promoCode, setPromoCode] = useState<string>("");
    const [isApplied, setIsApplied] = useState<boolean>(false);
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

    const validateCouponMutation = useMutation({
        mutationFn: (code: string) => validateCoupon(code, totalAmount),
        onSuccess: (res) => {
            const couponData = res.data;
            setIsApplied(true);
            setAppliedCoupon(couponData);
            if (onApply) {
                onApply(couponData);
            }
            toaster.create({
                title: "Coupon Applied",
                description: `Successfully applied coupon: ${couponData.code}`,
                type: "success",
            });
        },
        onError: (error: any) => {
            toaster.create({
                title: "Invalid Coupon",
                description: error.response?.data?.message || "Failed to apply coupon. Please check the code and try again.",
                type: "error",
            });
        }
    });

    const handleApplyPromoCode = () => {
        if (!promoCode || promoCode.trim() === "") {
            toaster.create({
                title: "Error",
                description: "Please enter a coupon code",
                type: "error",
            });
            return;
        }
        validateCouponMutation.mutate(promoCode);
    }

    return (
        <>
            <Flex
                gap={4}
                flexDir={"column"}>
                <Flex
                    gap={3}
                    flexDirection={"column"}>
                    <Input
                        borderColor={"background.300/70"}
                        borderWidth={2}
                        variant={"subtle"}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter Coupon Code here" />
                    <Button
                        loading={validateCouponMutation.isPending}
                        onClick={handleApplyPromoCode}
                        w={"full"}>APPLY COUPON</Button>

                </Flex>
                {isApplied && appliedCoupon && (
                    <Alert.Root
                        borderWidth={1}
                        borderColor={"text.100"}
                        bg="primary.300">
                        <Box>
                            <Alert.Description>
                                <Text
                                    color={"secondary.200"}
                                    textAlign={"center"}
                                    fontSize={"sm"}
                                    lineHeight={1.3}
                                    fontWeight={"500"}>
                                    Hooray! You've qualified for a {appliedCoupon.discountValue} {appliedCoupon.type === 'FixedAmount' ? '' : '%'} discount!</Text>
                            </Alert.Description>
                        </Box>
                    </Alert.Root>
                )}
            </Flex >
        </>
    )
}
