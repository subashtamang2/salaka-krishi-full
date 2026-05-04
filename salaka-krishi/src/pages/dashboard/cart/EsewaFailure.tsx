import { useEffect } from "react";
import { Flex, Heading, Text, Button, Box } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router";
import routes from "@src/router/routes";
import CustomContainer from "@src/components/common/CustomContainer";

export default function EsewaFailure() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        // SAFE GUARD: We NEVER auto-cancel the order on page load anymore.
        // The order remains in 'WAITING_ESEWA' state which is protected from background cancellation.
        // This allows the user to click "Try Again" without losing their order.
        console.log("[EsewaFailure] Safe guard active: Order NOT cancelled. Waiting for user action or background job.");
    }, []);

    return (
        <CustomContainer py={20}>
            <Flex direction="column" align="center" justify="center" minH="50vh" gap={6}>
                <Box color="red.500" fontSize="6xl">✕</Box>
                <Heading size="xl" color="red.500">Payment Failed</Heading>
                <Text fontSize="lg">The payment process was cancelled or failed. Please try again.</Text>
                
                {searchParams.get("error") && (
                    <Text color="red.400" fontSize="sm">Reason: {searchParams.get("error")}</Text>
                )}

                <Flex gap={4}>
                    <Button 
                        bg="primary.300" 
                        color="white" 
                        _hover={{ bg: "primary.400" }}
                        onClick={() => navigate(routes.cart.cartCheckout)}
                    >
                        Try Again
                    </Button>
                    <Button 
                        variant="outline"
                        borderColor="primary.300"
                        color="primary.300"
                        onClick={() => navigate(routes.home)}
                    >
                        Go to Home
                    </Button>
                </Flex>
            </Flex>
        </CustomContainer>
    );
}
