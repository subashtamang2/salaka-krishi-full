import { Flex, Image } from "@chakra-ui/react";
import { getImageSrc } from "@src/utils/image";
interface SingleImageCardProps {
    image: {
        url: string;
        title?: string
    };
}
export default function SingleImageCard({image}: SingleImageCardProps) {
    return (
            <Flex
                flexDir="column"
                align="center"
                gap={2}>
                <Flex
                    height={{
                        base: "250px",
                        md: "337px"
                    }}
                    width={{
                        base: "300px",
                        sm: "450px",
                        md: "450px",
                        lg: "401px",
                    }}>
                    <Image
                        src={getImageSrc(image.url)}
                        alt={image.title}
                        height={"100%"}
                        width={"100%"}
                        objectPosition={"top"}
                        objectFit={"contain"} />
                </Flex>
            </Flex>

    );
}
