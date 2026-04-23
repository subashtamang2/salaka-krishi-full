import { Flex, Image } from "@chakra-ui/react";
import LightGallery from "lightgallery/react";
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import type { GalleryCardSchema } from "@src/schema/schema";
import { getImageSrc } from "@src/utils/image";
interface SmallCardProps {
    data: GalleryCardSchema;
}
export default function LargeCard({ data }: SmallCardProps) {
    const onInit = () => {

    };

    return (
        <>
            <LightGallery
                onInit={onInit}
                speed={500}>
                <Flex
                    width={"full"}
                    height={"660px"}
                    data-src={getImageSrc(data.image)}>
                    <Image src={getImageSrc(data.image)}
                        alt={data.title}
                        height="100%"
                        width="100%"
                        objectFit={"cover"}
                        objectPosition={"center"}
                    />
                </Flex>
            </LightGallery>

        </>)
}
