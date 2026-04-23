import { Grid, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";
interface NoOfRows {
    base: number;
    md: number;
    lg: number;
    xl: number;
};
export default function ProductRow({ noOfRows = { base: 1, md: 2, lg: 3, xl: 4 } }: { noOfRows?: NoOfRows }) {
    return (
        <>
            <CustomContainer
                pt={6}
                overflow={"hidden"}
                height={"330px"}>
                <Grid
                    rowGap={6}
                    columnGap={4}
                    placeContent={"center"}
                    templateColumns={{
                        base: `repeat(${noOfRows.base}, 1fr)`,
                        md: `repeat(${noOfRows.md}, 1fr)`,
                        lg: `repeat(${noOfRows.lg}, 1fr)`,
                        xl: `repeat(${noOfRows.xl}, 1fr)`
                    }}>
                    {Array.from({ length: noOfRows.xl }).map((_, index) => (
                        <Stack key={index} maxW="100%" p={4}
                            background={"white"}
                            gap={4}>
                            <Skeleton
                                height="200px"
                                borderRadius="lg" />
                            <SkeletonText
                                noOfLines={3}
                                gap="4" />
                        </Stack>))
                    }
                </Grid>
            </CustomContainer>
        </>
    )
}
