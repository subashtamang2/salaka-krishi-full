import { Flex, Heading, Text, Button, Icon } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import routes from "@src/router/routes";
import { HiOutlineShoppingCart } from "react-icons/hi";

export default function EmptyCart() {
    const navigate = useNavigate();

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            py={20}
            px={4}
            textAlign="center"
            gap={6}
        >
            <Icon as={HiOutlineShoppingCart} boxSize={20} color="primary.300/30" />
            <Flex direction="column" gap={2}>
                <Heading size="xl" color="primary.300">
                    Your cart is empty
                </Heading>
                <Text fontSize="lg" color="text.400">
                    Looks like you haven't added anything yet.
                </Text>
            </Flex>
            <Button
                bg="primary.300"
                color="white"
                size="lg"
                px={10}
                _hover={{ bg: "primary.400" }}
                onClick={() => navigate(routes.products.root)}
            >
                Browse Products
            </Button>
        </Flex>
    );
}
