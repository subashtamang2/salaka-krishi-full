import { Flex, Heading, Text, Button, Icon } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import routes from "@src/router/routes";
import { HiOutlineHeart } from "react-icons/hi";

export default function EmptyWishlist() {
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
            width="full"
        >
            <Icon as={HiOutlineHeart} boxSize={20} color="primary.300/30" />
            <Flex direction="column" gap={2}>
                <Heading size="xl" color="primary.100">
                    Your wishlist is empty
                </Heading>
                <Text fontSize="lg" color="text.400">
                    Save items that you like in your wishlist.
                </Text>
            </Flex>
            <Button
                bg="primary.100"
                color="white"
                size="lg"
                px={10}
                _hover={{ bg: "primary.300" }}
                onClick={() => navigate(routes.products.root)}
            >
                Add Items to Wishlist
            </Button>
        </Flex>
    );
}
