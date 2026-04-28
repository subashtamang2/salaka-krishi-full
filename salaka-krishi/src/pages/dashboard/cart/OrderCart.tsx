import {
    Button,
    Flex,
    Grid,
    Heading,
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
            queryClient.invalidateQueries({ queryKey: ['checkout-summary'] });
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
            queryClient.invalidateQueries({ queryKey: ['checkout-summary'] });
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


            gap={{
                base: 3,
                lg: 4
            }}
            flexDir={"column"}>
            <Flex
                flexDir={{
                    base: "column",
                    md: "row",
                }}

                gap={{
                    base: 1,
                    md: 3,
                    xl: 2
                }}
                justifyContent={"space-between"}
                alignItems={{
                    base: "start",
                    md: "center"
                }}>
                <Flex


                    flex={1}
                    flexDir={{
                        base: "column",
                        sm: "row"
                    }}
                    w={{
                        base: "full",
                        sm: "fit-content"
                    }}
                    alignItems={{
                        base: "start",
                        sm: "center"
                    }}>
                    <Flex
                        width={{
                            base: "100%",
                            sm: "170px",
                            lg: "150px",
                            xl: "150px",
                            "2xl": "160px",
                        }}
                        height={{
                            base: "240px",
                            sm: "180px"
                        }}>
                        <Image
                            height={"full"}
                            width={"full"}
                            objectPosition={"top"}
                            objectFit={"cover"}
                            src={getImageSrc(currentProduct?.imageUrls?.[0])}
                            alt={currentProduct?.name} />
                    </Flex>
                </Flex>
                <Flex
                    flexDir={"column"}
                    width={"full"}>
                    <Flex

                        flex={1}
                        w={{
                            base: "full",
                            sm: "fit-content"
                        }}
                        flexDir={{
                            base: "column",
                            sm: "row"
                        }}


                        justifyContent={{
                            base: "center"
                        }}
                        alignItems={{
                            base: "center",
                            sm: "center"
                        }}
                        gap={{
                            base: 4,
                            xl: 4,
                        }}>
                        <Flex

                            alignItems={{
                                base: "start",
                                md: "start",
                            }}
                            gap={1}

                            flexDir={"column"}>
                            <Heading
                                textAlign={"start"}
                                fontWeight={500}
                                fontFamily={"primary"}
                                color={"primary.300"}
                                fontSize={{
                                    base: "xl",
                                    lg: "xl",
                                    xl: "2xl"
                                }}>
                                {currentProduct?.name}
                            </Heading>
                            <Flex

                                justifyContent={"end"}
                                alignItems={{
                                    base: "start",
                                    md: "start",
                                }}
                                gap={4}

                                flexDir={"column"}>

                                <Text
                                    color={"text.1100"}
                                    fontWeight={400}
                                    fontSize={"lg"}>Quantity</Text>
                                <Flex

                                    alignItems={{
                                        base: "center",
                                        md: "start"
                                    }}

                                    flexDir="row"
                                    gap={{
                                        base: "2",
                                        md: "6",
                                        lg: "2",
                                        xl: "6",
                                    }}>

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
                                                base: "xl",
                                                lg: "xl",
                                                xl: "2xl"
                                            }}
                                            bg="white"
                                            color="primary.300"
                                            py={0}
                                            px={{
                                                base: "4",
                                                md: "2",
                                                lg: "2",
                                                xl: "2",

                                            }}
                                            onClick={() => handleQuantityChange(value - 1)}>-</Button>
                                        <Flex
                                            bg={"secondary.200"}

                                            alignItems={"center"}
                                            justifyContent={"center"}
                                            fontWeight={700}
                                            fontSize={{
                                                base: "xl",
                                                xl: "2xl"
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
                                                base: "xl",
                                                lg: "xl",
                                                xl: "2xl"
                                            }}

                                            py={0}
                                            px={{
                                                base: "4",
                                                md: "2",
                                                lg: "2",
                                                xl: "2",

                                            }}
                                            onClick={() => handleQuantityChange(value + 1)}>+</Button>

                                    </Grid>
                                    <Text
                                        fontWeight={500}
                                        color={"primary.300"}
                                        whiteSpace="nowrap"
                                        flexShrink={0}
                                        fontSize={{
                                            base: "xl",
                                            lg: "xl",
                                            xl: "2xl"
                                        }}
                                    >{formatPrice(displayPrice)}</Text>
                                </Flex>
                                <Flex
                                    gap={3}>
                                    <Button
                                        textDecoration={"underline"}
                                        px="0"
                                        py="0"
                                        bg="none"
                                        height={"fit-content"}
                                        fontSize={"md"}
                                        color={"primary.300"}
                                        fontWeight={400}
                                        _hover={{
                                            bg: "none",
                                        }}
                                        _focus={{
                                            bg: "none",
                                        }}
                                        onClick={handleRemoveFromCart}
                                    >Remove
                                    </Button>
                                    <Button
                                        textDecoration={"underline"}
                                        px="0"
                                        py="0"
                                        bg="none"
                                        height={"fit-content"}
                                        fontSize={"md"}
                                        color={"primary.300"}
                                        fontWeight={400}
                                        _hover={{
                                            bg: "none",
                                        }}
                                        _focus={{
                                            bg: "none",
                                        }}
                                        onClick={handleViewProduct}
                                    >View
                                    </Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex >
    );
}
