import { SkeletonText, Stack, Skeleton } from "@chakra-ui/react";


export default function StaticPageLoading() {
    return (
        <Stack gap={12} width="full">
            {[...Array(3)].map((_, i) => (
                <Stack key={i} gap={6}>
                    <Skeleton height="32px" width="40%" borderRadius="md" />
                    <SkeletonText noOfLines={5} gap={4} />
                </Stack>
            ))}
        </Stack>
    );
}
