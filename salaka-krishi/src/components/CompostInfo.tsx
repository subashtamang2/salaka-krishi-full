import { Flex, Grid, GridItem, Heading, Image, Text } from "@chakra-ui/react";
import vermicompostimage from "@assets/images/vermicompost/vermicompost1.png";
import CustomContainer from "./common/CustomContainer";
import { VermicompostInfo } from "@src/data/CompostInfo";

export default function CompostInfo() {
    return (
        <>
            <CustomContainer pt={{
                base: "14",
                md: "16",

            }}>
                <Grid templateColumns={{
                    base: "100%",
                    xl: "45% 47%",
                }}
                    gap={{
                        base: "4"
                    }}
                    justifyContent={"space-between"}
                    py={10} >
                    <GridItem>
                        <Flex
                            width={"full"}
                            height={"374px"}>
                            <Image
                                src={vermicompostimage}
                                alt="image"
                                height="100%"
                                width="100%"
                                objectFit={"cover"}
                                borderTopRightRadius={"50px"}
                                borderBottomLeftRadius={"50px"}
                                objectPosition={"top"} />
                        </Flex>
                    </GridItem>
                    <Flex
                        gap={6}
                        flexDir={"column"}>
                        <Heading
                            lineHeight={"37px"}
                            color={"primary.100"}
                            fontSize={{
                                base: "2xl",
                                md: "3xl"
                            }}
                            fontFamily={"primary"}
                            fontWeight={700}>
                            {VermicompostInfo.title}

                        </Heading>
                        <Text
                            textStyle={"desc"}>
                            {VermicompostInfo.description}
                        </Text>
                    </Flex>

                    <GridItem>
                    </GridItem>
                </Grid>

            </CustomContainer>

        </>)
}
