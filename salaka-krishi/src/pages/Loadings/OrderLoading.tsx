import { Box, Flex, Skeleton, VStack, HStack, Separator } from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";

export default function OrderLoading() {
    return (
        <CustomContainer py={10}>
            <VStack align="stretch" gap={6} mt={6}>
                <Skeleton height="40px" width="200px" />
                {[1, 2, 3].map((i) => (
                    <Box 
                        key={i} 
                        p={6} 
                        borderWidth={1} 
                        borderColor="gray.100" 
                        borderRadius="lg"
                        bg="white"
                    >
                        <Flex justifyContent="space-between" mb={4} wrap="wrap" gap={4}>
                            <HStack gap={6}>
                                <VStack align="start" gap={1}>
                                    <Skeleton height="12px" width="80px" />
                                    <Skeleton height="20px" width="120px" />
                                </VStack>
                                <VStack align="start" gap={1}>
                                    <Skeleton height="12px" width="80px" />
                                    <Skeleton height="20px" width="100px" />
                                </VStack>
                                <VStack align="start" gap={1}>
                                    <Skeleton height="12px" width="80px" />
                                    <Skeleton height="20px" width="80px" />
                                </VStack>
                            </HStack>
                            <Skeleton height="30px" width="100px" borderRadius="full" />
                        </Flex>
                        <Separator mb={4} opacity={0.3} />
                        <VStack align="stretch" gap={3}>
                            {[1, 2].map((j) => (
                                <Flex key={j} justifyContent="space-between">
                                    <HStack gap={4}>
                                        <Skeleton boxSize="50px" borderRadius="md" />
                                        <VStack align="start" gap={1}>
                                            <Skeleton height="15px" width="150px" />
                                            <Skeleton height="12px" width="40px" />
                                        </VStack>
                                    </HStack>
                                    <Skeleton height="20px" width="60px" />
                                </Flex>
                            ))}
                        </VStack>
                    </Box>
                ))}
            </VStack>
        </CustomContainer>
    );
}
