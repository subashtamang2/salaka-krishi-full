import {
Grid,
 Skeleton
 } from "@chakra-ui/react";

export const GalleryCardSkeleton = () => {
    return (
        <Skeleton
            width="100%"
            height={{
                base: "300px",
            }}
            borderRadius="sm"
        />
    );
};

interface GalleryLoadingProps {
    count?: number;
}


export default function GalleryLoading({ count = 8 }: GalleryLoadingProps) {
    return (
        <Grid
            templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
            }}
            gap={6}
            w="full"
        >
            {[...Array(count)].map((_, i) => (
                <GalleryCardSkeleton key={i} />
            ))}
        </Grid>
    );
}
