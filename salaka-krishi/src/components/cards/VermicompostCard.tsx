import { Flex, Heading, IconButton, Image, Text } from "@chakra-ui/react";
import type { ProductSchema } from "@src/schema/product";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTocart } from "@src/api/cart";
import { addToWishlist } from "@src/api/wishlist";
import { toaster } from "../ui/toaster";
import {
    PiShoppingCartLight,
    PiHeartStraightLight,
} from "react-icons/pi";
import { getImageSrc } from "@src/utils/image";
import { getAccessToken } from "@src/utils/local-storage";
import { useAuthModalStore } from "@src/store/useAuthModalStore";

interface VermicompostProps {
    data: ProductSchema,
}
export default function VermicompostCard({ data }: VermicompostProps) {
    const queryClient = useQueryClient();
    const [isHovered, setIsHovered] = useState(false);

    const [wishlistStatus, setWishlistStatus] = useState<boolean>(data.isInWishlist ?? false);
    const [cartStatus, setCartStatus] = useState<boolean>(data.isInCart ?? false);

    const imageUrl = getImageSrc(data?.imageUrl || data?.imageUrls?.[0]);

    const addToCartMutation = useMutation({
        mutationFn: async (productId: string) => {
            const res = await addTocart(productId, 1);
            return res.data;
        }
    });

    const { openModal } = useAuthModalStore();

    const handleAddToCart = () => {
        if (!getAccessToken()) {
            openModal();
            return;
        }
        addToCartMutation.mutate(data.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["currentUser"] });
                queryClient.invalidateQueries({ queryKey: ["cart"] });
                setCartStatus(true);
                toaster.create({
                    title: "Added to Cart",
                    description: `${data.name} has been added to your cart.`,
                    type: "success",
                    duration: 2000,
                });
            },
            onError: () => {
                toaster.create({
                    title: "Error",
                    description: `Failed to add ${data.name} to your cart.`,
                    type: "error",
                    duration: 2000,
                });
            }
        });
    }

    const addToWishListMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await addToWishlist(id);
            return res.data;
        }
    });

    const handleAddToWishList = () => {
        if (!getAccessToken()) {
            openModal();
            return;
        }
        addToWishListMutation.mutate(data.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["currentUser"] });
                queryClient.invalidateQueries({ queryKey: ["wishlist"] });
                setWishlistStatus(!wishlistStatus);
                toaster.create({
                    title: wishlistStatus ? "Removed from wishlist" : "Added to wishlist",
                    description: `${data.name} has been ${wishlistStatus ? "removed from" : "added to"} your wishlist.`,
                    type: wishlistStatus ? "error" : "success",
                    duration: 3000,
                })
            },
            onError: () => {
                toaster.create({
                    title: "Error",
                    description: `Failed to add ${data.name} to your wishlist.`,
                    type: "error",
                    duration: 3000,
                });
            }
        });
    }

    return (
        <>
            <Flex
                gap={{
                    base: "0",
                    md: "6"
                }}
                alignItems={{
                    base: "center",
                    md: "start",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                flexDir={"column"}>
                <Flex
                    position={"relative"}
                    width={"full"}
                    height={{
                        base: "370px",
                        sm: "560px",
                        md: "320px",
                        lg: "311px",
                    }}>
                    <Image
                        boxSizing="border-box"
                        src={imageUrl}
                        alt=""
                        w="100%"
                        h="100%"
                        objectFit={"cover"}
                        borderTopRightRadius={"30px"}
                        borderBottomLeftRadius={"30px"}
                        objectPosition={"top"}
                        transition="all 0.5s ease"
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor={isHovered ? "primary.100" : "transparent"}
                        shadow={isHovered ? "black.100" : "none"} />
                    <Flex
                        justifyContent={"center"}
                        alignItems={"Center"}
                        bg={"primary.100/60"}
                        height={"20%"}
                        width={"full"}
                        opacity={isHovered ? 1 : 0}
                        top={"50%"}
                        left={"50%"}
                        transform="translate(-50%, -0%)"
                        pos={"absolute"}
                        transition="0.3s ease">
                        <Flex>
                            <IconButton
                                fontSize="2xl"
                                aria-label="Add to wishlist"
                                bg="transparent"
                                color={wishlistStatus ? "white" : "black"}
                                size={"2xl"}
                                rounded="md"
                                className="small-icon"
                                _hover={{ bg: "transparent" }}
                                _active={{ bg: "transparent" }}
                                loading={addToWishListMutation.isPending}
                                onClick={handleAddToWishList}>
                                <PiHeartStraightLight />
                            </IconButton>
                            <IconButton
                                aria-label="Add to Cart"
                                bg="transparent"
                                color="muted.200"
                                className="small-icon"
                                rounded="md"
                                _hover={{ bg: "transparent" }}
                                _active={{ bg: "transparent" }}
                                size={"2xl"}
                                loading={addToCartMutation.isPending}
                                disabled={cartStatus}
                                onClick={handleAddToCart}
                            >
                                <PiShoppingCartLight />
                            </IconButton>
                        </Flex>
                    </Flex>

                </Flex>
                <Flex
                    flexDir={"column"}
                    gap={1}>
                    <Heading
                        color={"secondary.100"}
                        fontSize={{
                            base: "lg",
                            md: "xl"
                        }}
                        fontWeight={400}>
                        {data.name}
                    </Heading>
                    <Text
                        color={"primary.100"}
                        fontSize={{
                            base: "lg",
                            md: "xl"
                        }}
                        fontWeight={400}>
                        RS. {(data.price ?? 0).toFixed(2)}
                    </Text>
                </Flex>
            </Flex>

        </>
    )
}
