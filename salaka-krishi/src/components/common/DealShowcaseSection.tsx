import { Button, Flex, Grid, GridItem, Heading, Image, Text } from "@chakra-ui/react";

import CustomContainer from "./CustomContainer";
interface DealShowsectionProps {
    image: string,
    title: string;
    subTitle: string,
    description: string;
}

export default function DealShowcaseSection({
    image,
    title,
    subTitle,
    description
}: DealShowsectionProps) {
    return (
        <>

            <CustomContainer
                bg={"primary.100"}
                py={12}>
                <Grid
                    templateColumns={{
                        base: "100%",
                        lg: "55% 40%",
                        xl: "55% 35%",

                    }}
                    justifyContent={"space-between"}
                    gap={{
                        base: "10",
                        md: "10",
                        lg: "0"
                    }}
                    alignItems={"center"}>

                    <GridItem order={{
                        base: 2,
                        lg: 0
                    }}
                        width="100%"
                    >

                        <Flex
                            flexDir={"column"}
                            alignItems={{ base: "center", lg: "flex-start" }}
                            textAlign={{ base: "center", lg: "left" }}
                            gap={{
                                base: "6",
                                lg: "12",
                            }}>
                            <Flex
                                flexDir={"column"}
                                alignItems={{ base: "center", lg: "flex-start" }}
                                gap={{
                                    base: "4",
                                    md: "2"
                                }}>
                                <Heading as={"h3"}
                                    textStyle={"titleMd"}>
                                    {subTitle}
                                </Heading>
                                <Heading as={"h2"}
                                    textStyle={"title"}>
                                    {title}
                                </Heading>
                            </Flex>
                            <Text textStyle={"cardDesc"}>
                                {description}
                            </Text>
                            <Button
                                size={"lg"}
                                alignSelf={{ base: "center", lg: "start" }}
                                variant={"solid"}
                                _hover={{
                                    background: "primary.300",
                                    color: "secondary.200"
                                }}
                                colorScheme={"white"}>
                                SHOP NOW</Button>
                        </Flex>
                    </GridItem>
                    <GridItem order={{
                        base: 1,
                        lg: 0,

                    }}
                        width="100%"
                        display="flex"
                        justifyContent="center">
                        <Flex
                            height={{
                                base: "auto",
                                md: "337px"
                            }}
                            width={{
                                base: "100%",
                                md: "450px",
                                lg: "401px",
                            }}
                            maxWidth="450px"
                            aspectRatio={{ base: 1, md: "auto" }}>
                            <Image
                                src={image}
                                height={"100%"}
                                width={"100%"}
                                alt="product"
                                objectPosition={"center"}
                                objectFit={"contain"} />
                        </Flex>
                    </GridItem>

                </Grid>

            </CustomContainer>



        </>)
}
