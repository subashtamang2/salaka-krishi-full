import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Flex, Heading, Text, Spinner, Button, Box } from "@chakra-ui/react";
import { toaster } from "@src/components/ui/toaster";
import axios from "@src/utils/axios-interceptor";
import routes from "@src/router/routes";
import CustomContainer from "@src/components/common/CustomContainer";

export default function KhaltiSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    const pidx = searchParams.get("pidx");

    useEffect(() => {
        if (pidx) {
            verifyPayment(pidx);
        } else {
            const statusParam = searchParams.get("status");
            if (statusParam === "User canceled") {
                toaster.create({
                    title: "Payment Canceled",
                    description: "You canceled the Khalti payment process.",
                    type: "info",
                });
                
                const purchaseOrderId = searchParams.get("purchase_order_id");
                if (purchaseOrderId) {
                    axios.patch(`/orders/${purchaseOrderId}/payment-failed`).catch(console.error);
                }

                navigate(routes.cart.cartCheckout);
            } else {
                setStatus("error");
                setLoading(false);
            }
        }
    }, [pidx]);

    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => {
                navigate(routes.orderHistory);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    const verifyPayment = async (pidx: string) => {
        try {
            // Double Verification: Always confirm with the backend /lookup/ API
            const response = await axios.get(`/orders/verify-khalti?pidx=${pidx}`);
            
            if (response.status === 200 || response.status === 201) {
                setStatus("success");
                toaster.create({
                    title: "Payment Successful",
                    description: "Your Khalti payment has been verified successfully.",
                    type: "success",
                });
            } else {
                setStatus("error");
            }
        } catch (error: any) {
            console.error("Khalti verification failed", error);
            setStatus("error");
            toaster.create({
                title: "Verification Failed",
                description: error?.response?.data?.message || "Failed to verify your Khalti payment. Please contact support.",
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
                        <Heading size="lg" color="primary.300">Verifying Khalti Payment...</Heading>
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
                        <Text fontSize="lg">We couldn't verify your Khalti payment. If the amount was deducted, please contact us.</Text>
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
