import { Flex, Heading, Image, Text } from "@chakra-ui/react";
import CustomContainer from "./common/CustomContainer";
import { getImageSrc } from "@src/utils/image";
interface BannerSectionProps {
    title: string;
    date: string;
    backgroundImage: string;

}
export default function BlogDetailsBanner({ title, date, backgroundImage }: BannerSectionProps) {
    return (
        <Flex
            position={"relative"}
            height={"40vh"} >
            <Flex
                position={"absolute"}
                height={"100%"}
                width={"full"}
                top={0}
                left={0}
                _after={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    w: "100%",
                    h: "100%",
                    bg: "primary.300/70",
                    zIndex: 1,
                }}>
                <Image
                    src={getImageSrc(backgroundImage)}
                    height={"100%"}
                    width={"100%"}
                    objectPosition={"center"}
                    objectFit={"cover"} />
            </Flex>
            <Flex
                position={"relative"}
                height={"100%"}
                flexDir={"column"}
                width={"100%"}
                zIndex={2}>
                <CustomContainer
                    height={"100%"}
                    display={"flex"}>
                    <Flex
                        direction={"column"}
                        height={"100%"}
                        alignItems={"start"}
                        pb={6}
                        justifyContent={"end"}>
                        <Flex
                            display="inline-flex"
                            maxW={{ base: "90%", md: "70%" }}

                            flexDir={"column"}
                            py={2}
                            px={6}
                            gap={2}
                            bg={"primary.100/70"} >
                            <Heading
                                textStyle={"blogDetailsBannerTitle"}
                                as={"h3"}>
                                {title}
                            </Heading>
                            <Text
                                color={"secondary.200"}
                                fontWeight={300}
                                fontSize={"sm"}>
                                {date}
                            </Text>
                        </Flex>

                    </Flex>
                </CustomContainer>
            </Flex>
        </Flex>
    );
};
