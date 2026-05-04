import { Grid } from "@chakra-ui/react";
import banner from "@assets/images/gallery/banner.png";
import GalleryCard from "@src/components/cards/gallery/GalleryCard";
import CustomContainer from "@src/components/common/CustomContainer";
import SecondaryBanner from "@src/components/common/SecondaryBanner";
import { useQuery } from "@tanstack/react-query";
import { getGalery } from "@src/api/gallery";
import type { DataWrapper, GalleryCardSchema } from "@src/schema/schema";
import type { GalleryInterface } from "@src/schema/gallery";
import GalleryLoading from "@src/pages/Loadings/GalleryLoading";
import NotFoundSm from "../NotFoundSm";

export default function FullGallery() {
    //  Fetch Gallery from API
    const { data, isLoading } = useQuery<
        DataWrapper<GalleryInterface[]>
    >({
        queryKey: ["full-gallery"],
        queryFn: async () => {

            try {
                const res = await getGalery();
                return res?.data;
            } catch (e) {
                console.error("Gallery API error:", e);
                return null;
            }
        },
    });

    // Map backend data to GalleryCardSchema
    const rawData = data?.data;
    const galleryData: GalleryCardSchema[] = Array.isArray(rawData)
        ? rawData.map(item => ({
            id: item.id,
            title: item.title,
            image: item.imageUrl
        }))
        : [];

    return (
        <>
            <SecondaryBanner
                title="Gallery"
                backgroundImage={banner} />

            <CustomContainer>
                {isLoading ? (
                    <GalleryLoading count={8} />
                ) : (
                    <>
                        {galleryData.length > 0 ? (
                            <Grid
                                templateColumns={{
                                    base: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)",
                                    lg: "repeat(4, 1fr)",
                                }}
                                gap={6}
                                p={6}
                            >
                                {galleryData.map((item) => (
                                    <GalleryCard key={item.id} data={item} />
                                ))}
                            </Grid>
                        ) : (
                            <NotFoundSm />
                        )}
                    </>
                )}
            </CustomContainer>
        </>
    );
}
