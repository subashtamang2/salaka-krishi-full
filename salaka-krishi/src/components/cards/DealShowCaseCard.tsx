// import { Button, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
// import CustomContainer from "../common/CustomContainer";
// import type { DealShowaseSchema } from "@src/schema/schema";
// import SingleImageCard from "./SingleImageCard";
// import RoundedImageCardSection from "./RoundedImageCardSection";

// interface DealShowsectionProps {
//     data: DealShowaseSchema,
// }
// export default function DealShowCaseCard({ data }: DealShowsectionProps) {
//     const isMultipleImages = data.images?.length > 1;
//     return (
//         <>
//             <CustomContainer
//                 bg={"primary.100"}
//                 py={16}>
//                 <Grid
//                     templateColumns={{
//                         base: "100%",
//                         lg: "55% 40%",
//                         xl: "50% 50%",

//                     }}
//                     justifyContent={"space-between"}
//                     gap={{
//                         base: "10",
//                         md: "10",
//                         lg: "0"
//                     }}
//                     alignItems={"center"}>

//                     <GridItem order={{
//                         base: 2,
//                         lg: 0
//                     }}


//                     >

//                         <Flex
//                             flexDir={"column"}
//                             gap={{
//                                 base: "6",
//                                 lg: "12",
//                             }}>
//                             <Flex
//                                 flexDir={"column"}
//                                 gap={{
//                                     base: "4",
//                                     md: "2"
//                                 }}>

//                                 <Heading as={"h3"}
//                                     textStyle={"titleMd"}>
//                                     {data.subTitle}
//                                 </Heading>
//                                 <Heading as={"h2"}
//                                     textStyle={"title"}>
//                                     {data.title}
//                                 </Heading>
//                             </Flex>
//                             <Text textStyle={"cardDesc"}>
//                                 {data.description}
//                             </Text>
//                             <Button
//                                 textTransform={"uppercase"}
//                                 size={"lg"}
//                                 alignSelf={"start"}
//                                 variant={"solid"}
//                                 _hover={{
//                                     background: "primary.300",
//                                     color: "secondary.200"
//                                 }}
//                                 colorScheme={"white"}>
//                                 {data.buttonLink}
//                             </Button>
//                         </Flex>
//                     </GridItem>
//                     <GridItem order={{
//                         base: 1,
//                         lg: 0,

//                     }}

//                     >
//                         <Flex
//                             justifyContent={{
//                                 base: "flex-start",
//                                 lg: "flex-end"
//                             }}>
//                             {isMultipleImages ? (
//                                 <RoundedImageCardSection images={data.images} />
//                             ) : (
//                                 <SingleImageCard image={data.images[0]} />
//                             )}
//                         </Flex>
//                     </GridItem>

//                 </Grid>

//             </CustomContainer>

//         </>
//     )
// }




import { Button, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import CustomContainer from "../common/CustomContainer";
import type { DealShowaseSchema } from "@src/schema/schema";
import SingleImageCard from "./SingleImageCard";
import RoundedImageCardSection from "./RoundedImageCardSection";

interface DealShowsectionProps {
    data: DealShowaseSchema,
}
export default function DealShowCaseCard({ data }: DealShowsectionProps) {
    const isMultipleImages = data.images?.length > 1;
    return (
        <>
            <CustomContainer
                bg={"primary.100"}
                py={16}>
                <Grid
                    templateColumns={{
                        base: "100%",
                        lg: "55% 40%",
                        xl: "50% 50%",

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


                    >

                        <Flex
                            flexDir={"column"}
                            gap={{
                                base: "6",
                                lg: "12",
                            }}>
                            <Flex
                                flexDir={"column"}
                                gap={{
                                    base: "4",
                                    md: "2"
                                }}>

                                <Heading as={"h3"}
                                    textStyle={"titleMd"}>
                                    {data.subTitle}
                                </Heading>
                                <Heading as={"h2"}
                                    textStyle={"title"}>
                                    {data.title}
                                </Heading>
                            </Flex>
                            <Text textStyle={"cardDesc"}>
                                {data.description}
                            </Text>
                            <Button
                                textTransform="uppercase"
                                size="lg"
                                alignSelf="start"
                                variant="solid"
                                _hover={{ background: "primary.300", color: "secondary.200" }}
                                colorScheme="white"
                                onClick={typeof data.buttonLink === "function" ? data.buttonLink : undefined}
                            >
                                {typeof data.buttonLink === "string" ? data.buttonLink : "Shop Now"}
                            </Button>
                        </Flex>
                    </GridItem>
                    <GridItem order={{
                        base: 1,
                        lg: 0,

                    }}

                    >
                        <Flex
                            justifyContent={{
                                base: "flex-start",
                                lg: "flex-end"
                            }}>
                            {isMultipleImages ? (
                                <RoundedImageCardSection images={data.images} />
                            ) : (
                                <SingleImageCard image={data.images[0]} />
                            )}
                        </Flex>
                    </GridItem>

                </Grid>

            </CustomContainer>

        </>
    )
}
