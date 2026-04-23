import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Flex, Heading, Text, Spinner, Button, Box } from "@chakra-ui/react";
import { toaster } from "@src/components/ui/toaster";
import axios from "@src/utils/axios-interceptor";
import routes from "@src/router/routes";
import CustomContainer from "@src/components/common/CustomContainer";

export default function EsewaSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    const data = searchParams.get("data");

    useEffect(() => {
        if (data) {
            verifyPayment(data);
        } else {
            setStatus("error");
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => {
                navigate(routes.orderHistory);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    const verifyPayment = async (encodedData: string) => {
        try {
            // Double Verification: Always confirm with the backend
            const response = await axios.get(`/orders/verify-esewa?data=${encodedData}`);
            
            if (response.status === 200 || response.status === 201) {
                setStatus("success");
                localStorage.removeItem("pendingEsewaOrderId");
                toaster.create({
                    title: "Payment Successful",
                    description: "Your payment has been verified successfully.",
                    type: "success",
                });
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Verification failed", error);
            setStatus("error");
            toaster.create({
                title: "Verification Failed",
                description: "Failed to verify your payment. Please contact support.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomContainer py={20}>
            <Flex direction="column" align="center" justify="center" minH="50vh" gap={6}>
                {loading ? (
                    <>
                        <Spinner size="xl" color="primary.300" />
                        <Heading size="lg" color="primary.300">Verifying Payment...</Heading>
                        <Text>Please do not refresh the page or go back.</Text>
                    </>
                ) : status === "success" ? (
                    <>
                        <Box color="green.500" fontSize="6xl">✓</Box>
                        <Heading size="xl" color="primary.300">Payment Successful!</Heading>
                        <Text fontSize="lg">Your order has been confirmed and is being processed.</Text>
                        <Text color="text.400" fontSize="sm">
                            You will be redirected to My Orders in a few seconds...
                        </Text>
                        <Button 
                            bg="primary.300" 
                            color="white" 
                            _hover={{ bg: "primary.400" }}
                            onClick={() => navigate(routes.orderHistory)}
                        >
                            View My Orders
                        </Button>
                    </>
                ) : (
                    <>
                        <Box color="red.500" fontSize="6xl">✕</Box>
                        <Heading size="xl" color="red.500">Verification Failed</Heading>
                        <Text fontSize="lg">We couldn't verify your payment. If the amount was deducted, please contact us.</Text>
                        <Button 
                            variant="outline"
                            borderColor="primary.300"
                            color="primary.300"
                            onClick={() => navigate(routes.cart.cartCheckout)}
                        >
                            Back to Cart
                        </Button>
                    </>
                )}
            </Flex>
        </CustomContainer>
    );
}
