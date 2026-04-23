import { Flex, Image, Text } from "@chakra-ui/react";

import LightGallery from "lightgallery/react";
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import type { GalleryCardSchema } from "@src/schema/schema";
import { getImageSrc } from "@src/utils/image";
interface GalleryCardProps {
    data: GalleryCardSchema;
}
export default function GalleryCard({ data }: GalleryCardProps) {
    const onInit = () => {

    };
    return (
        <LightGallery
            onInit={onInit}
            speed={500}>
            <Flex
                position="relative"
                cursor="pointer"
                overflow="hidden"
                role="group"
                borderRadius="sm"
                data-src={getImageSrc(data.image)}
                w="100%"
                h={{
                    base: "300px"
                }} >
                <Image
                    src={getImageSrc(data.image)}
                    alt={data.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    objectPosition="center"
                    transition="all 0.3s ease"
                    _groupHover={{
                        transform: "scale(1.05)",
                        filter: "brightness(50%)",
                    }}/>

                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    w="100%"
                    h="100%"
                    align="center"
                    justify="center"
                    opacity={0}
                    transition="opacity 0.3s ease"
                    _groupHover={{ opacity: 1 }}>
                    <Text
                        color="white"
                        fontWeight="bold"
                        fontSize="xl"
                        textAlign="center"
                        px={2} >
                        {data.title}
                    </Text>
                </Flex>
            </Flex>
        </LightGallery>
    );
}
