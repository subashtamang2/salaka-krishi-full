import { Flex, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import { MissionData } from "@src/data/About";
import missionImage from "@assets/images/about/mission.png"
export default function MissionCard() {
    return (
        <>
            <Grid templateColumns={{
                base: "1fr",
                xl: "55% 40%",
                "2xl": "50% 40%",
            }}
                justifyContent={{
                    base: "space-around",
                    lg: "space-between",
                    "2xl": "space-around",
                }}
                gap={{
                    base: "8",
                    xl: "0",
                }}
                alignItems={{
                    base: "start",
                    lg: "center",
                }}>

                <GridItem order={{
                    base: 2,
                    xl: 1,
                }}>
                    <Flex
                        flexDir={"column"}
                        gap={6}>
                        {MissionData.map((item) => (
                            <Flex key={item.id}
                                flexDir={"column"}
                                gap={2}>

                                <Text
                                    fontWeight={700}
                                    fontSize={"xl"}
                                    color={"primary.300"}>
                                    {item.title}
                                </Text>

                                <Text
                                    lineHeight={"1.5"}
                                    color={"text.400"}
                                    fontSize={{
                                        base: "md",
                                        md: "lg"
                                    }}
                                    fontWeight={300}>{item.description}</Text>
                            </Flex>
                        ))}
                    </Flex>
                </GridItem>

                <GridItem order={{
                    base: 1,
                    xl: 2
                }}>
                    <Flex
                        height={"600px"}
                        width={{
                            base: "100%",
                            md: "60%",
                            lg: "70%",
                            xl: "100%",
                        }}
                        flexDir={"column"}>
                        <Image
                            src={missionImage}
                            alt="mission image"
                            height="100%"
                            width="100%"
                            objectFit={"cover"}
                            objectPosition={"top"}
                        />
                    </Flex>
                </GridItem>
            </Grid>
        </>)
}
