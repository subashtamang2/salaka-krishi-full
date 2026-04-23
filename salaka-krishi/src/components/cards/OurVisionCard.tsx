import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import CustomContainer from "../common/CustomContainer";
interface OurVisionCardProps {
    backgroundImage: string;
    title: string,
    subtitle: string,
    description: string,
}

export default function OurVisionCard({ backgroundImage, title, subtitle, description }: OurVisionCardProps) {
    return (
        <>
            <Flex
                position={"relative"}
                flexDir={"column"}
            >
                <Flex
                    position={"absolute"}
                    top={0}
                    left={0}
                    width={"100%"}
                    height={"100%"} >
                    <Image
                        src={backgroundImage}
                        height={"100%"}
                        objectFit={"cover"}
                        objectPosition={"center"}
                        width={"100%"} />
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        width="100%"
                        height="100%"
                        bg="primary.300/90"
                    />
                </Flex>
                <CustomContainer
                    py={16}
                    alignItems={"Center"}
                    height="100%"
                    display={"flex"}


                    position={"relative"} >
                    <Flex
                        alignItems="center"
                        flexDir={"column"}
                        gap={{
                            base: "10",
                        }}

                    >
                        <Flex
                            flexWrap={"wrap"}
                            flexDir={"Column"}
                            width={{ base: "100%", md: "80%" }}
                            gap={6}>
                            <Heading
                                lineHeight={1.4}
                                fontSize={{
                                    base: "3xl",
                                    md: "5xl",
                                }}
                                fontWeight={700}

                                color={"secondary.200"}
                                textAlign={{
                                    base:
                                        "center",

                                }}>
                                {title}
                            </Heading>
                            <Text
                                fontSize={"lg"}
                                fontWeight={500}
                                color={"secondary.200"}
                                textAlign={"Center"}>
                                {subtitle}
                            </Text>
                        </Flex>
                        <Flex
                            flexDir={"column"}
                            gap={2}>

                            <Flex>
                                <Text
                                    fontSize={{
                                        base: "md",
                                    }}
                                    fontWeight={300}
                                    color={"secondary.200"}
                                    textAlign={"Center"}>
                                    {description}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </CustomContainer>
            </Flex>
        </>
    )
}
