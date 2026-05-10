import {
    Flex,
    IconButton,
    Image,
    Text
} from "@chakra-ui/react";
import { addTocart } from "@src/api/cart";
import { addToWishlist } from "@src/api/wishlist";
import type { ProductSchema } from "@src/schema/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
    PiShoppingCartLight,
    PiHeartStraightLight,
} from "react-icons/pi";
import { toaster } from "../ui/toaster";
import { usePrice } from "@src/hooks/usePrice";
import { getImageSrc } from "@src/utils/image";
import { getAccessToken } from "@src/utils/local-storage";
import { useAuthModalStore } from "@src/store/useAuthModalStore";
import { isProductNew } from "@src/utils/product";


interface ProductProps {
    product: ProductSchema;
}

export default function ProductCard({ product }: ProductProps) {
    const queryClient = useQueryClient();
    const [isHovered, setIsHovered] = useState(false);
    const hasDiscount = !!product.discountPercentage;



    const [wishlistStatus, setWishlistStatus] = useState<boolean>(product.isInWishlist ?? false);
    const [cartStatus, setCartStatus] = useState<boolean>(product.isInCart ?? false);
    const { formatPrice } = usePrice();
    const recentDaysForNewProduct = Number(import.meta.env.VITE_RECENT_DAYS_FOR_NEW_PRODUCT) || 7;

    const isPreOrder = product.availability === "PreOrder";
    const isNew = isProductNew(product.createdAt, recentDaysForNewProduct);
    const isOutOfStock = (product.stock ?? 0) <= 0;


    const productPriceAfterDiscount = product.discountPercentage
        ? product.price - (product.price * product.discountPercentage) / 100
        : product.price;

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
        addToCartMutation.mutate(product.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["currentUser"] });
                queryClient.invalidateQueries({ queryKey: ["cart"] });
                setCartStatus(!cartStatus);
                toaster.create({
                    title: "Added to Cart",
                    description: `${product.name} has been added to your cart.`,
                    type: "success",
                    duration: 5000,
                });
            },
            onError: () => {
                toaster.create({
                    title: "Error",
                    description: `Failed to add ${product.name} to your cart.`,
                    type: "error",
                    duration: 5000,
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
        addToWishListMutation.mutate(product.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["currentUser"] });
                queryClient.invalidateQueries({ queryKey: ["wishlist"] });
                setWishlistStatus(!wishlistStatus);
                toaster.create({
                    title: wishlistStatus ? "Removed from wishlist" : "Added to wishlist",
                    description: `${product.name} has been ${wishlistStatus ? "removed from" : "added to"} your wishlist.`,
                    type: wishlistStatus ? "error" : "success",
                    duration: 3000,
                })
            },

            onError: () => {
                toaster.create({
                    title: "Error",
                    description: `Failed to add ${product.name} to your wishlist.`,
                    type: "error",
                    duration: 3000,
                });
            }
        });
    }
    return (
        <Flex
            flexDir="column"
            overflow={"hidden"}
            w={{
                base: "full",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <Flex

                position={"relative"}
                width="100%"
                align={"center"}
                overflow={"hidden"}
                justify={"center"}>
                {!isOutOfStock && !isPreOrder && isNew &&
                    <Text
                        color="secondary.200"
                        bg="primary.100"
                        position="absolute"
                        top={0}
                        left={0}
                        px={8}
                        py={2}
                        fontSize={"sm"}
                        fontWeight={600}
                        zIndex={2}>
                        New
                    </Text>
                }
                {isOutOfStock && (
                    <Text
                        color="white"
                        bg="red.500"
                        position="absolute"
                        top={0}
                        left={0}
                        px={8}
                        py={2}
                        fontSize={"sm"}
                        fontWeight={600}
                        zIndex={2}>
                        Out of Stock
                    </Text>
                )}
                {!product.createdAt && hasDiscount && (
                    <Text
                        color="secondary.200"
                        bg="status.200"
                        position="absolute"
                        top={0}
                        left={0}
                        px={8}
                        py={2}
                        fontSize={"sm"}
                        fontWeight={600}
                        zIndex={2}>
                        Sale
                    </Text>
                )}
                <Flex
                    flexDir="column"
                    overflow="hidden"
                    borderTopRightRadius="30px"
                    borderBottomLeftRadius="30px"
                    w={{
                        base: "full",
                    }}
                    role="group"
                    pos={"relative"}
                    bg={"secondary.250"}
                    borderWidth={1}
                    borderColor={isHovered ? "primary.100" : "transparent"}
                    h={{
                        base: "250px",
                        md: "200px",
                        lg: "210px",
                        xl: "250px",

                    }}>
                    <Image
                        src={getImageSrc(product?.imageUrls?.[0] || product?.imageUrl)}
                        alt={product.name || product.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        objectPosition="center"
                        transform={isHovered ? "scale(1.05)" : "scale(1)"}
                        transition="transform 0.3s ease" />
                    <Flex
                        justifyContent={"center"}
                        alignItems={"Center"}
                        bg={"primary.100/60"}
                        height={"25%"}
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
                                bg={wishlistStatus ? "transparent" : "transparent"}
                                color={wishlistStatus ? "white" : "black"}
                                size={"2xl"}
                                rounded="md"
                                className="small-icon"
                                _hover={{ bg: "transparent" }}
                                _active={{ bg: "transparent" }}
                                onClick={handleAddToWishList}>
                                <  PiHeartStraightLight />
                            </IconButton>
                            <IconButton
                                onClick={isOutOfStock ? undefined : handleAddToCart}
                                aria-label="Add to Cart"
                                bg="transparent"
                                color="muted.200"
                                className="small-icon"
                                disabled={cartStatus || isOutOfStock}
                                rounded="md"
                                _hover={{ bg: "transparent" }}
                                _active={{ bg: "transparent" }}
                                size={"2xl"}>
                                <  PiShoppingCartLight />
                            </IconButton>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>

            <Flex
                flexDir="column"
                p={4}>
                <Text fontSize="xl"
                    color={"secondary.100"}
                    fontWeight={400}>
                    {product?.name || product?.title}
                </Text>
                <Flex
                    gap={6}
                    justifyContent={"space-between"}>

                    <>
                        <Text
                            color="primary.100"
                            fontSize="xl"
                            fontWeight={400}>{formatPrice(productPriceAfterDiscount)}</Text>
                        {
                            (product?.discountPercentage ?? 0) > 0 &&

                            <Text
                                textDecoration="line-through"
                                fontSize="xl"
                                fontWeight={400}
                                color="text.200"
                            >{formatPrice(product.price)}
                            </Text>
                        }
                    </>


                </Flex>

            </Flex>
        </Flex>


    );
}
