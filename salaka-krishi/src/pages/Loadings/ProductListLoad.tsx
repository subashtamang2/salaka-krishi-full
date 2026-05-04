import {
    Box,
    Grid,
    HStack,
    Skeleton,
    Stack,
    useBreakpointValue
} from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";

interface NoOfRows {
    base: number;
    md: number;
    lg: number;
    xl: number;
}

export default function ProductListLoad({
    noOfRows = { base: 1, md: 2, lg: 3, xl: 4 },
}: {
    noOfRows?: NoOfRows;
}) {

    const columns = useBreakpointValue({
        base: noOfRows.base,
        // md: noOfRows.md,
        // lg: noOfRows.lg,
        // xl: noOfRows.xl,
    });

    return (
        <CustomContainer pt={6} overflow={"hidden"}>
            <Grid
                rowGap={6}
                columnGap={4}
                placeContent={"center"}
                templateColumns={{
                    base: `repeat(${noOfRows.base}, 1fr)`,
                    // md: `repeat(${noOfRows.md}, 1fr)`,
                    // lg: `repeat(${noOfRows.lg}, 1fr)`,
                    // // xl: `repeat(${noOfRows.xl}, 1fr)`,
                }}>
                {Array.from({ length: columns || 1 }).map((_, index) => (
                    <Stack
                        key={index}
                        maxW="100%"
                        p={4}
                        background={"white"}
                        gap={4}
                    >
                        <HStack gap="4" align="center">
                            <Skeleton height="60px" width="60px" borderRadius="md" />

                            <Box flex="1">
                                <Skeleton height="12px" mb={2} />
                                <Skeleton height="12px" />
                            </Box>
                        </HStack>

                        <HStack gap="4" align="center">
                            <Skeleton height="60px" width="60px" borderRadius="md" />

                            <Box flex="1">
                                <Skeleton height="12px" mb={2} />
                                <Skeleton height="12px" />
                            </Box>
                        </HStack>
                        <HStack gap="4" align="center">
                            <Skeleton height="60px" width="60px" borderRadius="md" />

                            <Box flex="1">
                                <Skeleton height="12px" mb={2} />
                                <Skeleton height="12px" />
                            </Box>
                        </HStack>

                    </Stack>
                ))}
            </Grid>
        </CustomContainer>
    );
}
