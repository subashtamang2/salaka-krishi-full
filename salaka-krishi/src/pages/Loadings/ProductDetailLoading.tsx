import { Flex, Grid, GridItem, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";

/**
 * A performance-optimized, simple skeleton for the Product Details page.
 * Matches the layout of ProductDetails.tsx precisely.
 */
export default function ProductDetailLoading() {
    return (
        <CustomContainer py={{ base: 10, md: 20 }} bg="background.300/6">
            <Grid
                templateColumns={{
                    base: "1fr",
                    md: "40% 45%",
                    lg: "42% 47%",
                    xl: "45% 50%",
                }}
                justifyContent="space-between"
            >
                {/* Left Column: Image & Main Description */}
                <GridItem>
                    <Stack gap={4}>
                        {/* Product Image Skeleton */}
                        <Skeleton
                            width={{ base: "100%", md: "350px" }}
                            height="270px"
                            borderRadius="14px"
                        />
                        
                        {/* Description Section */}
                        <Skeleton height="24px" width="120px" mt={2} />
                        <Skeleton height="32px" width="80%" />
                        <SkeletonText noOfLines={4} gap={3} />
                    </Stack>
                </GridItem>

                {/* Right Column: Pricing, Ratings, and Actions */}
                <GridItem>
                    <Stack gap={6}>
                        {/* Title & Price Section */}
                        <Stack gap={2}>
                            <Skeleton height="40px" width="70%" />
                            <Flex gap={8}>
                                <Skeleton height="32px" width="100px" />
                                <Skeleton height="28px" width="80px" />
                            </Flex>
                        </Stack>

                        {/* Ratings Skeleton */}
                        <Flex gap={4} alignItems="center">
                            <Skeleton height="20px" width="120px" />
                            <Skeleton height="20px" width="80px" />
                            <Skeleton height="20px" width="80px" />
                        </Flex>

                        {/* Short Description Skeleton */}
                        <SkeletonText noOfLines={3} gap={3} />

                        {/* Delivery & Assistance Blocks */}
                        <Stack gap={4}>
                            <Skeleton height="30px" width="80%" />
                            <Skeleton height="60px" width="100%" borderRadius="md" />
                            <Skeleton height="30px" width="60%" />
                            <Skeleton height="80px" width="100%" borderRadius="md" />
                        </Stack>

                        {/* Action Buttons Skeleton */}
                        <Flex gap={{ base: 4, sm: 6 }} py={{ base: 8, md: 16 }}>
                            <Skeleton height="48px" width={{ base: "100%", sm: "160px" }} borderRadius="md" />
                            <Skeleton height="48px" width={{ base: "100%", sm: "180px" }} borderRadius="md" />
                        </Flex>
                    </Stack>
                </GridItem>
            </Grid>
        </CustomContainer>
    );
}
