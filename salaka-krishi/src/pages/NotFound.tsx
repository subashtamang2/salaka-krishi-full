import { Flex, Heading, Image, Text } from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";
import NotFoundIllustration from "@assets/images/maintainace/404.svg";


export default function NotFound({ title }: { title?: string }) {
    const titleArray = title?.split(' ') || [];
    const remainder = titleArray.length > 1 ? titleArray.slice(1)?.join(' ') : null;

    return (
        <>
            <CustomContainer>
                <Flex
                    height={"80vh"}
                    flexDir={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={4}>
                    <Flex
                        flexDir={"column"}
                        alignItems={"center"}
                        gap={{
                            base: "20",
                            lg: "20",
                        }} >
                        <Flex
                            height={{
                                base: "200px",
                                md: "250px",
                                lg: "300px"
                            }}
                            width={{
                                base: "300px",
                                md: "400px",
                                lg: "500px",

                            }}>
                            <Image src={NotFoundIllustration}
                                alt={"svg iamges"}
                                height={"100%"}
                                width={"100%"}
                                objectFit={"cover"}
                                objectPosition={"bottom"}
                            />
                        </Flex>

                        <Flex
                            flexDir={"column"}
                            gap={{
                                base: "8",
                                md: "12",
                                lg: "14",
                            }}
                            justifyContent={"center"}
                            alignItems={"center"}>
                            <Heading
                                lineHeight={1.2}
                                as={"h1"}
                                fontSize={{
                                    base: "5xl",
                                    lg: "5xl",
                                }}
                                textAlign={"center"}
                            >
                                <Text as={"span"} display={"block"}>
                                    {titleArray[0]}
                                </Text>
                                {remainder ?? "Data not found."}
                            </Heading>
                        </Flex>
                    </Flex>

                </Flex>
            </CustomContainer>
        </>
    )
}
