import {
    Button,
    Flex,
    Grid,
    Heading,
    Image,
    Text,
    useControllableState,
} from "@chakra-ui/react";
import { removeFromCart, updateCartQuantity } from "@src/api/cart";
import type { ProductSchema } from "@src/schema/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "../ui/toaster";
import { useNavigate } from "react-router";
import routes from "@src/router/routes";
import { getImageSrc } from "@src/utils/image";
interface CartProps {
    product: {
        product: ProductSchema;
        quantity: number;
        totalPrice: number;
    }
}
export default function Cart({ product }: CartProps) {
    console.log("Cart props:", product);
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const currentProduct = product?.product;

    const removeProductMutation = useMutation({
        mutationKey: ['remove-cart-product'],
        mutationFn: async (productId: string) => {
            const res = await removeFromCart(productId);
            return res;
        }
    });
    const [value, setValue] = useControllableState({ defaultValue: product?.quantity || 1 });

    const handleRemoveFromCart = () => {
        removeProductMutation.mutate(currentProduct.id, {
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
    }

    const updateQuantityMutation = useMutation({
        mutationFn: ({ quantity }: { quantity: number }) => {
            console.log("Updating cart quantity:", { productId: currentProduct.id, quantity });
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
        setValue(newVal);
        updateQuantityMutation.mutate({ quantity: newVal });
    }

    const handleNavigate = () => {
        navigate(routes.productDetails.replace(":slug", currentProduct.slug));
    }


    const handleViewProduct = () => {
        navigate(routes.productDetails.replace(":slug", currentProduct.slug));
    }


    const cartActions = [
        {
            id: "1",
            label: "Remove",
            action: handleRemoveFromCart,
        },
        {
            id: "2",
            label: "View",
            action: handleViewProduct,
        },
    ]

    // const discountedPrice = (currentProduct.price - (currentProduct.price * (currentProduct.discountPercentage ?? 0) / 100)) * value;
    return (
        <>
            <Flex
                gap={{
                    base: 3,
                    lg: 4
                }}
                flexDir={"column"}>
                <Flex
                    key={currentProduct?.id}
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
                            cursor={"pointer"}
                            onClick={handleNavigate}
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
                                alt="Product Image" />
                        </Flex>
                    </Flex>
                    <Flex flexDir={"column"}
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
                            justifyContent={{ base: "center" }}
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
                                        <Text fontWeight={500} color={"primary.300"}
                                            fontSize={{
                                                base: "xl",
                                                lg: "xl",
                                                xl: "2xl"
                                            }}
                                        >Rs.{currentProduct?.price}</Text>
                                    </Flex>
                                    <Flex
                                        gap={3}>
                                        {
                                            cartActions.map(cart => <Button
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
                                                onClick={cart.action}
                                                key={cart.id}>{cart.label}</Button>)
                                        }
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex >

        </>
    );
}
