import {
    Button,
    Flex,
    Grid,
    Image,
    Text,
} from "@chakra-ui/react";
import type { ProductSchema } from "@src/schema/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromCart, updateCartQuantity } from "@src/api/cart";
import { toaster } from "@src/components/ui/toaster";
import { useNavigate } from "react-router";
import routes from "@src/router/routes";
import { usePrice } from "@src/hooks/usePrice";
import { getImageSrc } from "@src/utils/image";

interface CartProps {
    product: {
        product: ProductSchema;
        quantity: number;
        totalPrice: number;
    }
}
export default function OrderCart({ product }: CartProps) {
    const { formatPrice } = usePrice();
    const currentProduct = product?.product;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const value = product?.quantity || 1;
    // Compute display price - use totalPrice from API, fallback to price*quantity
    const displayPrice = (product?.totalPrice && product.totalPrice > 0)
        ? product.totalPrice
        : (currentProduct?.price || 0) * value;

    const removeProductMutation = useMutation({
        mutationKey: ['remove-cart-product'],
        mutationFn: async (productId: string) => {
            const res = await removeFromCart(productId);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            toaster.create({
                title: "Removed from cart",
                description: `${currentProduct.name} has been removed from your cart.`,
                duration: 5000,
            });
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: `failed to remove ${currentProduct.name} from your cart.`,
                type: "error",
                duration: 5000,
            });
        }
    });

    const updateQuantityMutation = useMutation({
        mutationFn: ({ quantity }: { quantity: number }) => {
            console.log("Updating quantity:", { productId: currentProduct.id, quantity });
            return updateCartQuantity(currentProduct.id, quantity);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to update quantity.",
                type: "error",
            });
        }
    });

    const handleQuantityChange = (newVal: number) => {
        if (newVal < 1) return;
        updateQuantityMutation.mutate({ quantity: newVal });
    }

    const handleRemoveFromCart = () => {
        removeProductMutation.mutate(currentProduct.id);
    }

    const handleViewProduct = () => {
        navigate(routes.productDetails.replace(":slug", currentProduct.slug));
    }

    return (
        <Flex
            px={3}
            py={4}
            gap={4}
            alignItems="center"
            borderBottomWidth={1}
            borderBottomColor="primary.100/20"
            _last={{ borderBottomWidth: 0 }}
        >
            <Flex
                width="80px"
                height="80px"
                borderRadius={"14px"}
                borderWidth={1}
                overflow={"hidden"}
                borderColor={"background.300"}
                flexShrink={0}
            >
                <Image
                    src={getImageSrc(currentProduct?.imageUrls?.[0])}
                    alt={currentProduct?.name}
                    h={"100%"}
                    w={"100%"}
                    objectFit={"cover"}
                    objectPosition={"center"} />
            </Flex>

            <Flex flexDir="column" gap={1} flex={1}>
                <Text fontWeight="600" fontSize="md" color="primary.400" lineClamp={1}>
                    {currentProduct?.name}
                </Text>
                <Flex justifyContent="space-between" alignItems="center">
                    <Grid
                        borderWidth={1}
                        borderColor={"primary.300"}
                        height={10}
                        templateColumns={"repeat(3, 1fr)"}>
                        <Button
                            h={"full"}
                            w={"full"}
                            rounded={"none"}
                            fontWeight={700}
                            fontSize={{
                                base: "lg",
                                xl: "xl"
                            }}
                            bg="white"
                            color="primary.300"
                            py={0}
                            px={2}
                            onClick={() => handleQuantityChange(value - 1)}>-</Button>
                        <Flex
                            bg={"secondary.200"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            fontWeight={700}
                            fontSize={{
                                base: "lg",
                                xl: "xl"
                            }}
                            color={"primary.300"}>
                            {value}
                        </Flex>
                        <Button
                            h={"full"}
                            w={"full"}
                            rounded={"none"}
                            bg="white"
                            color="primary.300"
                            fontWeight={700}
                            fontSize={{
                                base: "lg",
                                xl: "xl"
                            }}
                            py={0}
                            px={2}
                            onClick={() => handleQuantityChange(value + 1)}>+</Button>

                    </Grid>
                    <Text fontWeight="600" fontSize="sm" color="primary.100">
                        {formatPrice(displayPrice)}
                    </Text>
                </Flex>
                <Flex gap={3}>
                    <Button
                        variant="plain"
                        color="primary.300"
                        size="xs"
                        p={0}
                        height="auto"
                        width="fit-content"
                        textDecoration="underline"
                        fontWeight={400}
                        _hover={{ bg: "none" }}
                        onClick={handleRemoveFromCart}
                    >
                        Remove
                    </Button>
                    <Button
                        variant="plain"
                        color="primary.300"
                        size="xs"
                        p={0}
                        height="auto"
                        width="fit-content"
                        textDecoration="underline"
                        fontWeight={400}
                        _hover={{ bg: "none" }}
                        onClick={handleViewProduct}
                    >
                        View
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}
