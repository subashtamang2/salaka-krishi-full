import {
    Flex,
    IconButton,
    Image,
    Table,
    Text,
    Spinner,
    Center
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWishlist, removeWishlistItem } from "@src/api/wishlist";
import { addTocart, getCart } from "@src/api/cart";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { getAccessToken } from "@src/utils/local-storage";
import { getImageSrc } from "@src/utils/image";
import type { CartInterface, DataWrapper, wishlistWrapper } from "@src/schema/schema";
import type { ProductSchema } from "@src/schema/product";
import EmptyWishlist from "@src/pages/dashboard/wishlist/components/EmptyWishlist";
import { toaster } from "../ui/toaster";

export default function WishlistCard() {
    const queryClient = useQueryClient();
    const headers = ["Items", "Product Name", "Product Price", "Actions"];
    const accessToken = getAccessToken();

    const { data, isLoading, isError } = useQuery<DataWrapper<wishlistWrapper<ProductSchema[]>>>({
        queryKey: ['wishlist'],
        enabled: !!accessToken,
        queryFn: async () => {
            const res = await getWishlist();
            return res.data;
        }
    });

    const { data: cartData } = useQuery<CartInterface<ProductSchema>>({
        queryKey: ['cart'],
        enabled: !!accessToken,
        queryFn: async () => {
            const res = await getCart();
            return res.data;
        }
    });

    const isItemInCart = (productId: string) => {
        return cartData?.data?.products?.some((p: any) => {
            const pId = p.product?.id || p.product?.productId;
            return pId === productId;
        });
    };


    const removeMutation = useMutation({
        mutationFn: ({ id }: { id: string; showToast?: boolean; productName?: string }) => removeWishlistItem(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            if (variables.showToast !== false) {
                toaster.create({
                    title: "Removed from wishlist",
                    description: variables.productName ? `${variables.productName} has been removed from your wishlist.` : undefined,
                    type: "error",
                    duration: 3000
                });
            }
        },
        onError: () =>
            toaster.create({
                title: "Failed to remove item",
                type: "error"
            }),
    });


    const addToCartMutation = useMutation({
        mutationFn: ({ productId }: { productId: string; wishlistItemId: string; productName?: string }) => addTocart(productId, 1),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toaster.create({
                title: "Item added to cart",
                description: variables.productName ? `${variables.productName} has been added to your cart.` : undefined,
                type: "success",
                duration: 5000
            });
 
            removeMutation.mutate({ id: variables.wishlistItemId, showToast: false });
        },
        onError: () => toaster.create({ title: "Failed to add to cart", type: "error" }),
    });

    if (isLoading) {
        return (
            <Center py={10}>
                <Spinner size="xl" color="primary.300" />
            </Center>
        );
    }

    if (isError) {
        return (
            <Center py={10} flexDir="column" gap={4}>
                <Text color="red.500">Failed to load wishlist. Please try again later.</Text>
            </Center>
        );
    }
    const items = data?.data?.products || [];

    if (items.length === 0) {
        return <EmptyWishlist />;
    }

    return (
        <Flex overflowX={"auto"} width={"full"}>
            <Table.Root size="sm" variant={"clean" as any} >
                <Table.Header >
                    <Table.Row >
                        {headers.map((header) => (
                            <Table.ColumnHeader
                                _first={{ pl: 10 }}
                                key={header}
                                py={6}
                                whiteSpace="nowrap"
                                fontWeight={600}>
                                {header}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {items.map((item: any) => {
                        const product = item.product || item;
                        const imageUrl = product.imageUrls?.[0] || product.imageUrl || product.image;
                        const fullImageUrl = getImageSrc(imageUrl);

                        const inCart = isItemInCart(product.id || product.productId);
                        const isOutOfStock = (product.stock ?? 0) <= 0;

                        return (
                            <Table.Row key={item.id}>
                                <Table.Cell>
                                    <Flex
                                        height={{ base: "100px", md: "130px" }}
                                        width={{ base: "100px", md: "150px" }}
                                        position="relative">
                                        <Image
                                            src={fullImageUrl}
                                            alt={product.name}
                                            width={"100%"}
                                            height={"100%"}
                                            objectFit={"cover"}
                                            objectPosition={"center"}
                                        />
                                        {isOutOfStock && (
                                            <Flex
                                                position="absolute"
                                                top={0} left={0} right={0} bottom={0}
                                                bg="blackAlpha.600"
                                                align="center" justify="center">
                                                <Text color="white" fontSize="xs" fontWeight="bold">Out of Stock</Text>
                                            </Flex>
                                        )}
                                    </Flex>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text>{product.name || product.title}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text>Rs.{product.price}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Flex gap={8}>
                                        <IconButton
                                            borderRadius={"3px"}
                                            aria-label={isOutOfStock ? "Out of Stock" : (inCart ? "Already in Cart" : "Add to Cart")}
                                            size="lg"
                                            bg={(inCart || isOutOfStock) ? "gray.100" : "background.300/10"}
                                            color={(inCart || isOutOfStock) ? "gray.400" : "primary.300"}
                                            cursor={(inCart || isOutOfStock) ? "not-allowed" : "pointer"}
                                            disabled={addToCartMutation.isPending || !!inCart || isOutOfStock}
                                            onClick={() => !inCart && !isOutOfStock && addToCartMutation.mutate({
                                                productId: product.id || product.productId,
                                                wishlistItemId: item.id,
                                                productName: product.name || product.title
                                            })}>
                                            <FiShoppingCart />
                                        </IconButton>
                                        <IconButton
                                            borderRadius={"3px"}
                                            aria-label="Remove"
                                            size="lg"
                                            bg="background.500/10"
                                            color="primary.300"
                                            disabled={removeMutation.isPending}
                                            onClick={() => removeMutation.mutate({
                                                id: item.id,
                                                showToast: true,
                                                productName: product.name || product.title
                                            })}>
                                            <FiTrash2 />
                                        </IconButton>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>
        </Flex>
    );
}
