import {
 Flex,
 Skeleton,
SkeletonText,
 Grid
} from "@chakra-ui/react";


export const BlogCardSkeleton = () => {
    return (
        <Flex
            direction="column"
            gap={{ base: 4, md: 6 }}
            shadow="green.100"
            width="full"
            bg="white"
            overflow="hidden"
        >
            {/* Image Skeleton */}
            <Skeleton
                width="100%"
                height={{
                    base: "200px",
                    sm: "300px",
                    md: "200px",
                    lg: "150px",
                    xl: "250px",
                }}
                borderBottomLeftRadius="60px"
            />

            {/* Content Skeleton */}
            <Flex
                padding={3}
                direction="column"
                gap={3}
                flex="1"
            >
                {/* Title Skeleton */}
                <Skeleton height="24px" width="85%" borderRadius="md" />

                {/* Description Skeleton */}
                <SkeletonText
                    noOfLines={2}
                    gap={3}
                />

                {/* Read More Button Skeleton */}
                <Skeleton
                    height="20px"
                    width="80px"
                    alignSelf="flex-end"
                    borderRadius="sm"
                    mt={2}
                />
            </Flex>
        </Flex>
    );
};

interface BlogLoadingProps {
    count?: number;
}

/**
 * A grid of blog skeletons for the blog list page.
 */
export default function BlogLoading({ count = 6 }: BlogLoadingProps) {
    return (
        <Grid
            templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
            }}
            gap={{
                base: 8,
                lg: 6,
                xl: 10,
            }}
            w="full"
        >
            {[...Array(count)].map((_, i) => (
                <BlogCardSkeleton key={i} />
            ))}
        </Grid>
    );
}
