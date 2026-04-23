import { Flex, Heading, Image } from "@chakra-ui/react";
import { getImageSrc } from "@src/utils/image";

interface RoundedImageCardProps {
    images: {
        url: string;
        title: string;
    }[];
}

export default function RoundedImageCardSection({ images }: RoundedImageCardProps) {
    return (
        <Flex
            flexDir="row"
            flexWrap={{
                base: "wrap",
                md: "wrap"
            }}
            gap={6}
            justify="center"
            align="center" >
            {
                images.map((img, i) => (
                    <Flex
                        key={i}
                        flexDir="column"
                        align="center"
                        gap={2}>
                        <Flex
                            w={{
                                base: "100px",
                                md: "178px",
                                lg: "130px",
                                xl: "178px",
                            }}
                            h={{
                                base: "100px",
                                md: "178px",
                                lg: "130px",
                                xl: "178px",
                            }}
                            borderWidth="5px"
                            borderColor="primary.300"
                            borderRadius="full"
                            overflow="hidden"
                            alignItems="center"
                            justifyContent="center">
                            <Image
                                src={getImageSrc(img.url)}
                                height="full"
                                width="full"
                                objectFit="cover" />
                        </Flex>
                        <Heading
                            fontSize="xl"
                            color="secondary.200"
                            fontWeight={500}>
                            {img.title}
                        </Heading>
                    </Flex>
                ))
            }
        </Flex >
    );
}
