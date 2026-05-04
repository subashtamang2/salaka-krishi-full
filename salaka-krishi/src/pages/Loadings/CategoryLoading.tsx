import {
    Flex,
    SkeletonCircle,
    Skeleton,
    Stack
} from "@chakra-ui/react";


export default function CategoryLoading() {
    return (
        <Flex
            flexWrap={"wrap"}
            justifyContent={"center"}
            gap={{
                base: "8",
            }}
            width="full"
        >
            {[1, 2, 3, 4, 5].map((item) => (
                <Stack key={item}
                    align="center"
                    gap={4}>
                    <SkeletonCircle
                        size={{
                            base: "150px",
                            md: "160px",
                            xl: "178px",
                        }}
                    />
                    <Skeleton height="20px" width="80px" borderRadius="md" />
                </Stack>
            ))}
        </Flex>
    );
}
