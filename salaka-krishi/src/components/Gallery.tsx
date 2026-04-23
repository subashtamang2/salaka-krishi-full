import { Button, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import LargeCard from "./cards/gallery/LargeCard";
import SmallCard from "./cards/gallery/SmallCard";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { DataWrapper, GalleryCardSchema } from "@src/schema/schema";
import type { GalleryInterface } from "@src/schema/gallery";
import ProductRow from "@src/pages/Loadings/ProductRow";
import useIsVisible from "@src/utils/useIsVisible";
import { getGalery } from "@src/api/gallery";

export default function Gallery() {
    const navigate = useNavigate();
    const { ref, isVisible } = useIsVisible<HTMLDivElement>();
    const { data, isLoading } = useQuery<DataWrapper<GalleryInterface[]>
    >({
        queryKey: ["gallery"],
        enabled: !!isVisible,
        queryFn: async () => {

                const res = await getGalery();
                return res?.data;

        },
    });

    const rawData = data?.data;
    const galleryData: GalleryCardSchema[] = Array.isArray(rawData)
        ? rawData.map(item => ({
            id: item.id,
            title: item.title,
            image: item.imageUrl
        }))
        : [];

    const firstSix = galleryData.slice(0, 6);
    const restItems1 = firstSix.slice(1, 3);
    const restItems2 = firstSix.slice(4, 6);

    return (
        <Flex
            ref={ref}
            flexDir={"column"}
            gap={8}>
            <Heading
                textAlign={"center"}
                color={"primary.100"}
                fontSize={"3xl"}
                py={6}
                fontWeight={700}>
                Gallery
            </Heading>

            {isLoading ? (
                <ProductRow />
            ) : (
                <>
                    {galleryData.length > 0 ? (
                        <>
                            <Grid templateColumns={{
                                base: "100%",
                                md: "45% 48%",
                            }}
                                gap={{
                                    base: "8",
                                    md: "0"
                                }}
                                justifyContent={"space-around"}>
                                <GridItem>
                                    {firstSix[0] && <LargeCard data={firstSix[0]} />}
                                </GridItem>
                                <GridItem>
                                    <Flex direction="column" gap={8}>
                                        {restItems1.map((item) => (
                                            <SmallCard key={item.id} data={item} />
                                        ))}
                                    </Flex>
                                </GridItem>
                            </Grid>
                            <Grid templateColumns={{
                                base: "100%",
                                md: "45% 48%",
                            }}
                                gap={{
                                    base: "8",
                                    md: "0"
                                }}
                                justifyContent={"space-around"}>
                                <GridItem order={{
                                    base: 2,
                                    md: 1
                                }}>
                                    <Flex direction="column" gap={8}>
                                        {restItems2.map((item) => (
                                            <SmallCard key={item.id} data={item} />
                                        ))}
                                    </Flex>
                                </GridItem>
                                <GridItem order={{
                                    base: 1,
                                    md: 2,
                                }}>
                                    {firstSix[3] && <LargeCard data={firstSix[3]} />}
                                </GridItem>

                            </Grid>
                        </>
                    ) : (
                        <Flex justifyContent="center" py={10}>
                            <Heading size="md" color="gray.500">No gallery images found.</Heading>
                        </Flex>
                    )}
                </>
            )}

            <Button
                variant={"solid"}
                size={"md"}
                _hover={{ bg: "primary.300" }}
                onClick={() => navigate("/gallery")}
                alignSelf={"center"}>
                View More
            </Button>
        </Flex>
    )
}
