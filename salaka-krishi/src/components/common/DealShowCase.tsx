import {
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
} from "@chakra-ui/react";
import CustomContainer from "./CustomContainer";
import bgImage from "@assets/images/backgroundimage.png";
import { getBannersByTag } from "@src/api/banner";
import useNavigateToProductDetails from "@src/utils/useNavigateToProductDetails";
import { useQuery } from "@tanstack/react-query";

export default function DealShowcase() {
    const navigateToProductDetails = useNavigateToProductDetails();
    const baseImageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

    const { data: banner, isLoading } = useQuery({
        queryKey: ["black-friday-banner"],
        queryFn: async () => {
            const response = await getBannersByTag("BlackFriday") as any;
            const bannersArray = Array.isArray(response.data.data)
                ? response.data.data
                : [];

            return bannersArray.length > 0 ? bannersArray[0] : null;
        },
    });

    const normalizeImageUrl = (url?: string): string => {
        if (!url) return bgImage;
        return url.startsWith("http") ? url : `${baseImageUrl}/${url}`;
    };

    if (isLoading) return null;
    const now = new Date();
    const isBannerActive = banner &&
        (!banner.startDate || new Date(banner.startDate) <= now) &&
        (!banner.endDate || new Date(banner.endDate) >= now);

    if (!banner || !isBannerActive) return null;

    return (
        <CustomContainer
            bg="#F4F4F4"
            py={{
                base: "8",
                md: "16"
            }}>
            <Grid
                templateColumns={{
                    base: "100%",
                    lg: "55% 40%"
                }}
                gap={6}
                alignItems="center">

                <GridItem>
                    <Flex
                        flexDir="column"
                        gap={6}>

                        <Heading
                            fontSize={{
                                base: "md",
                                md: "xl",
                            }}
                            color="primary.100"
                            textTransform={"uppercase"}
                            fontWeight={500}>
                            {banner.title}
                        </Heading>

                        {banner.subtitle && (
                            <Heading
                                lineHeight={"1.3"}
                                fontSize={{
                                    base: "3xl",
                                    lg: "4xl"
                                }}
                                fontWeight={600}
                                color="text.400"
                                textTransform={"uppercase"}>
                                {banner.subtitle}
                            </Heading>
                        )}

                        {((banner as any).product?.id || (banner as any).productId) && (
                            <Button
                                alignSelf={"start"}
                                size="md"
                                variant="solid"
                                _hover={{
                                    background: "primary.300"
                                }}
                                onClick={() =>
                                    navigateToProductDetails(
                                        (banner as any).product?.id ||
                                        (banner as any).productId
                                    )
                                }>
                                SHOP NOW
                            </Button>
                        )}
                    </Flex>
                </GridItem>

                <GridItem>
                    <Flex
                        height={{
                            base: "300px",
                            md: "200px",
                            lg: "300px",
                        }}
                        width={{
                            base: "100%",
                            md: "50%",
                            lg: "100%",
                        }} >
                        <Image
                            src={normalizeImageUrl(banner.imageUrl)}
                            alt={banner.title}
                            objectFit="cover"
                            width="100%"
                            height="100%" />
                    </Flex>
                </GridItem>

            </Grid>
        </CustomContainer>
    );
}
