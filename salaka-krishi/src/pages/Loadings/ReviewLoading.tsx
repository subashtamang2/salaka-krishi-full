import { Flex,
 Skeleton,
SkeletonText,
HStack
} from "@chakra-ui/react";

export const ReviewCardSkeleton = () => {
    return (
        <Flex
            py={6}
            px={8}
            flexDir={"column"}
            bg={"white"}
            gap={2}
            border="1px solid transparent"
            borderTopRightRadius={"40px"}
            borderBottomLeftRadius={"40px"}
            height="100%"
            width={"full"} >

            <Skeleton
                height="28px"
                width="60%"
                borderRadius="md" />


            <Skeleton
                height="18px"
                width="40%"
                borderRadius="sm"
                mb={1} />


            <HStack gap={1} mb={1}>
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i}
                        boxSize="20px"
                        borderRadius="full" />
                ))}
            </HStack>


            <SkeletonText
                mt={2}
                noOfLines={3}
                gap={3}
                lineHeight="14px"
            />
        </Flex>
    );
};

interface ReviewLoadingProps {
    count?: number;
}

export default function ReviewLoading({ count = 4 }: ReviewLoadingProps) {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <ReviewCardSkeleton key={i} />
            ))}
        </>
    );
}
