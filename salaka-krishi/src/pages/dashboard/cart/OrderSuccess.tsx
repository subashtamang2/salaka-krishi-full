import {
    Box,
    Button,
    Flex,
    Heading,
    Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import routes from "@src/router/routes";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export default function OrderSuccess() {
    const navigate = useNavigate();

    // Auto-redirect to My Orders after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(routes.orderHistory);
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <>
            <Helmet>
                <title>Order Placed - Salaka Krishi</title>
            </Helmet>
            <Flex
                minH="70vh"
                alignItems="center"
                justifyContent="center"
                flexDir="column"
                gap={6}
                px={4}
                textAlign="center"
            >
                {/* Success checkmark */}
                <Flex
                    w={20}
                    h={20}
                    borderRadius="full"
                    bg="primary.300"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="4xl"
                    color="white"
                    fontWeight="bold"
                >
                    ✓
                </Flex>

                <Box>
                    <Heading
                        as="h2"
                        fontSize={{ base: "2xl", md: "3xl" }}
                        color="primary.300"
                        fontWeight={700}
                        mb={2}
                    >
                        Order Placed Successfully!
                    </Heading>
                    <Text color="text.300" fontSize="lg" maxW="400px">
                        Thank you for your order. We'll contact you shortly to confirm your delivery details.
                    </Text>
                </Box>

                <Text color="text.400" fontSize="sm">
                    You will be redirected to My Orders in a few seconds...
                </Text>

                <Flex gap={3} flexWrap="wrap" justifyContent="center">
                    <Button
                        bg="primary.300"
                        color="white"
                        px={6}
                        py={5}
                        _hover={{ bg: "primary.400" }}
                        onClick={() => navigate(routes.home)}
                    >
                        Continue Shopping
                    </Button>
                    <Button
                        variant="outline"
                        borderColor="primary.300"
                        color="primary.300"
                        px={6}
                        py={5}
                        _hover={{ bg: "primary.300/10" }}
                        onClick={() => navigate(routes.products.root)}
                    >
                        Browse Products
                    </Button>
                </Flex>
            </Flex>
        </>
    );
}
