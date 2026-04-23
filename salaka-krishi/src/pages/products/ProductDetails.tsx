import { Button, Flex, Grid, GridItem, Heading, Image, Link, Text, Spinner } from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";
import ProductShareLinks from "@src/components/common/ProductShareLinks";
import ContactInfoListSecondary from "@src/components/ContactInfoListSecondary";
import { FaRegHeart } from "react-icons/fa";
import ReviewRating from "@src/components/Rating";
import { useState, useEffect } from "react";
import { BsInfoLg } from "react-icons/bs";
import { useParams } from "react-router";
import type { ProductSchema } from "@src/schema/product";
import type { DataWrapper } from "@src/schema/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductDetails } from "@src/api/products";
import { addTocart } from "@src/api/cart";
import { addToWishlist } from "@src/api/wishlist";
import { toaster } from "@src/components/ui/toaster";
import { getEstimatedDeliveryRange } from "@src/utils/formatDate";
import { usePrice } from "@src/hooks/usePrice";
import ProductReviewFormModal from "@src/components/cards/review/ProductReviewFormModal";
import { getImageSrc } from "@src/utils/image";
import { getAccessToken } from "@src/utils/local-storage";
import { useAuthModalStore } from "@src/store/useAuthModalStore";
import { checkUserReview } from "@src/api/review";

export default function ProductDetails() {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const queryClient = useQueryClient();
    const { slug } = useParams<{ slug: string }>();

    const { data: response, isLoading, isError } = useQuery<DataWrapper<ProductSchema>>({
        queryKey: ["product", slug],
        queryFn: () => getProductDetails(slug!).then(res => res.data),
        enabled: !!slug,
    });

    const product = response?.data;
    const { formatPrice } = usePrice();

    const [wishlistStatus, setWishlistStatus] = useState<boolean>(false);
    const [cartStatus, setCartStatus] = useState<boolean>(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const isLoggedIn = !!getAccessToken();

    const { data: reviewCheckData } = useQuery({
        queryKey: ["reviewCheck", product?.id],
        queryFn: () => checkUserReview(product!.id).then(res => res.data),
        enabled: !!product?.id && isLoggedIn,
    });

    const hasReviewed = reviewCheckData?.data?.hasReviewed ?? false;

    // Sync state when product data is loaded
    useEffect(() => {
        if (product) {
            setWishlistStatus(product.isInWishlist ?? false);
            setCartStatus(product.isInCart ?? false);
        }
    }, [product]);

    const { openModal } = useAuthModalStore();

    const addToCartMutation = useMutation({
        mutationFn: async (productId: string) => {
            const res = await addTocart(productId, 1);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            setCartStatus(true);
            toaster.create({
                title: "Added to Cart",
                description: `${product?.name} has been added to your cart.`,
                type: "success",
            });
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: `Failed to add ${product?.name} to your cart.`,
                type: "error",
            });
        }
    });

    const addToWishListMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await addToWishlist(id);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            setWishlistStatus(prev => !prev);
            toaster.create({
                title: wishlistStatus ? "Removed from wishlist" : "Added to wishlist",
                description: `${product?.name} has been ${wishlistStatus ? "removed from" : "added to"} your wishlist.`,
                type: wishlistStatus ? "error" : "success",
            });
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: `Failed to update ${product?.name} in your wishlist.`,
                type: "error",
            });
        }
    });

    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="50vh">
                <Spinner size="xl" color="primary.100" />
            </Flex>
        );
    }

    if (isError || !product) {
        return (
            <CustomContainer py={20}>
                <Text fontSize="xl" color="red.500" textAlign="center">
                    Product not found: {slug}
                </Text>
            </CustomContainer>
        );
    }

    const productPriceAfterDiscount = product.discountPercentage
        ? product.price - (product.price * product.discountPercentage) / 100
        : product.price;

    const paragraphs = (product.description || "").split("\n").filter((p: string) => p.trim() !== "");
    const hasMultipleParagraphs = paragraphs.length > 1;

    const handleAddToCart = () => {
        if (!getAccessToken()) {
            openModal();
            return;
        }
        addToCartMutation.mutate(product.id);
    };

    const handleAddToWishList = () => {
        if (!getAccessToken()) {
            openModal();
            return;
        }
        addToWishListMutation.mutate(product.id);
    };

    return (
        <>
            <CustomContainer py={{
                base: 10,
                md: 20
            }}
                bg={"background.300/6"}>
                <Grid
                    templateColumns={{
                        base: "1fr",
                        md: "40% 45%",
                        lg: "42% 47%",
                        xl: "45% 50%",
                    }}
                    justifyContent={"space-between"} >
                    <GridItem >
                        <Flex
                            flexDir={"column"}
                            gap={4}>
                            <Flex
                                width={{
                                    base: "100%",
                                    md: "350px"
                                }}
                                height={{
                                    base: "270px"
                                }}
                                aspectRatio={1}
                                borderRadius={"14px"}
                                borderWidth={1}
                                overflow={"hidden"}
                                borderColor={"background.300"}>
                                <Image
                                    src={getImageSrc(product?.imageUrls?.[0])}
                                    alt={product.name || ""}
                                    h={"100%"}
                                    w={"100%"}
                                    objectFit={"cover"}
                                    objectPosition={"center"} />
                            </Flex>
                            <Text
                                color={"background.300"}
                                fontWeight={600}
                                fontSize={"lg"}>
                                Description
                            </Text>
                            <Heading
                                color={"primary.300"}
                                fontWeight={600}
                                fontSize={"2xl"}>
                                {product.name}
                            </Heading>
                            {paragraphs.slice(0, showFullDescription ? undefined : 1).map((para: string, idx: number) => (
                                <Text key={idx}
                                    fontSize={"md"}
                                    fontWeight={300}
                                    color={"secondary.100"}>
                                    {para}
                                </Text>
                            ))}

                            {hasMultipleParagraphs && (
                                <Link
                                    color={"primary.100"}
                                    width={300}
                                    fontSize={"md"}
                                    onClick={() => setShowFullDescription(prev => !prev)}>
                                    {showFullDescription ? "View Less" : "View More"}
                                </Link>
                            )}
                        </Flex>
                    </GridItem>

                    <GridItem>
                        <Flex flexDir={"column"} gap={6}>
                            <Flex flexDir={"column"} gap={2}>
                                <Heading
                                    fontSize={"2xl"}
                                    fontWeight={700}
                                    color={"primary.300"}>
                                    {product.name}
                                </Heading>
                                <Flex gap={8}>
                                    <Text fontSize={"2xl"}
                                        fontWeight={700}
                                        color={"primary.300"}>
                                        {formatPrice(productPriceAfterDiscount)}
                                    </Text>
                                    {!!product.discountPercentage && (
                                        <Text fontSize={"xl"}
                                            fontWeight={300}
                                            textDecoration={"line-through"}
                                            color={"text.200"}>
                                            {formatPrice(product.price)}
                                        </Text>
                                    )}
                                </Flex>
                                <Flex gap={4}>
                                    <ReviewRating
                                        readOnly={true}
                                        rating={product.rating || 0} />
                                    <Text fontSize={"lg"}
                                        color={"primary.300"}
                                        fontWeight={400}>{product._count?.reviews || 0} Reviews</Text>
                                    <Link fontSize={"lg"}
                                        color={hasReviewed ? "gray.400" : "primary.300"}
                                        fontWeight={400}
                                        textDecoration={hasReviewed ? "none" : "underline"}
                                        cursor={hasReviewed ? "not-allowed" : "pointer"}
                                        onClick={() => {
                                            if (hasReviewed) {
                                                toaster.create({
                                                    title: "Already Reviewed",
                                                    description: "You have already reviewed this product.",
                                                    type: "info",
                                                });
                                                return;
                                            }
                                            setIsReviewModalOpen(true);
                                        }}>
                                        {hasReviewed ? "Reviewed" : "Add Review"}
                                    </Link>
                                </Flex>

                                <Text fontSize={"md"}
                                    fontWeight={300}
                                    color={"text.100"}>
                                    {(product.description || "").length > 200
                                        ? (product.description || "").substring(0, 200) + "..."
                                        : (product.description || "")}
                                </Text>

                                <Flex
                                    gap={4}
                                    alignItems={"center"}
                                    justifyContent={{ base: "flex-start", md: "flex-end" }}>
                                    <Text
                                        fontSize={"lg"}
                                        fontWeight={400}
                                        color={"primary.300"}>
                                        Share: </Text>
                                    <ProductShareLinks 
                                        productName={product.name || ""} 
                                        productImage={getImageSrc(product?.imageUrls?.[0])} 
                                    />
                                </Flex>
                            </Flex>
                            <Text
                                fontSize={"xl"}
                                fontWeight={500}
                                color={"primary.300"} >
                                Estimated Delivery : {getEstimatedDeliveryRange(product.estimatedDeliveryMinDays, product.estimatedDeliveryMaxDays)}
                            </Text>
                            <Flex
                                gap={4}
                                fontWeight={400}
                                fontSize={"md"}
                                color={"secondary.100"}>
                                <BsInfoLg
                                    size={22}
                                    color="secondary.100" />
                                <Flex flexDir={"column"}>
                                    <Text >Need Assistance with your order ?</Text>
                                    <Text>We are here to help you in any way we can.</Text>
                                </Flex>
                            </Flex>
                            <Text
                                color={"primary.300"}
                                fontWeight={500}
                                fontSize={"xl"}>
                                Message us for Assistance:</Text>

                            <ContactInfoListSecondary />
                        </Flex>
                        <Flex
                            gap={{
                                base: 4,
                                sm: 6
                            }}
                            py={{
                                base: 8,
                                md: 16
                            }}>
                            <Button
                                py={6}
                                flex={{
                                    base: 1,
                                    sm: "initial"
                                }}
                                width={{
                                    base: "100%",
                                    sm: "auto"
                                }}
                                disabled={addToCartMutation.isPending || cartStatus}
                                onClick={handleAddToCart}
                                _hover={{
                                    bg: "primary.300"
                                }}>
                                {cartStatus ? "In Cart" : "Add to Cart"}
                            </Button>
                            <Button
                                variant="outline"
                                flex={{
                                    base: 1,
                                    sm: "initial"
                                }}
                                width={{
                                    base: "100%",
                                    sm: "auto"
                                }}
                                disabled={addToWishListMutation.isPending}
                                onClick={handleAddToWishList}
                            >
                                <Flex
                                    gap={2}
                                    fontSize={{
                                        base: "sm", xl: "lg"
                                    }}
                                    alignItems="center"
                                    justifyContent="center">
                                    <FaRegHeart color={wishlistStatus ? "#E53935" : "currentColor"} />
                                    <span>{wishlistStatus ? "In Wishlist" : "Add to Wishlist"}</span>
                                </Flex>
                            </Button>
                        </Flex>
                    </GridItem>
                </Grid>
            </CustomContainer>

            <ProductReviewFormModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                productId={product.id}
                productName={product.name || ""}
            />
        </>)
}
