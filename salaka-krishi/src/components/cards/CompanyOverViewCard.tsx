import { Flex, Grid, GridItem, Heading, Image, Text } from "@chakra-ui/react";

interface CompanyOverViewCardProps {
    ceoName: string;
    ceoTitle: string;
    companyName: string;
    description: string;
    image: string;
}

export default function CompanyOverViewCard({
    ceoName,
    ceoTitle,
    companyName,
    description,
    image
}: CompanyOverViewCardProps) {
    return (
        <>

            <Grid templateColumns={{
                base: "1fr",
                lg: "1fr",
                xl: "40% 55%",
                "2xl": "40% 50%",
            }}
                gap={{
                    base: 6,
                    md: "8",
                    lg: "4",
                    xl: "0",
                }}
                justifyContent={{
                    base: "space-around",
                    lg: "space-between",
                    "2xl": "space-around",
                }}
                alignItems={"center"}>
                <GridItem>
                    <Flex
                        height={"550px"}
                        width={{
                            base: "100%",
                            md: "60%",
                            lg: "70%",
                            xl: "100%",
                        }}
                        flexDir={"column"}>
                        <Image
                            src={image}
                            alt={ceoTitle}
                            height="100%"
                            width="100%"
                            objectFit={"cover"}
                            objectPosition={"top"}
                        />
                    </Flex>
                </GridItem>
                <Flex flexDir={"column"}
                    gap={{
                        base: "5",
                        md: "6",
                        lg: "5",
                    }}>

                    <Heading
                        textStyle={"title1"}>
                        Company Overview
                    </Heading>
                    <Flex flexDir={"column"}
                        gap={{
                            base: "0",
                            md: "2",
                            lg: "0"
                        }}>
                        <Text
                            color={"text.300"}>
                            {ceoName}
                        </Text>
                        <Text
                            color={"text.300"}>
                            {ceoTitle}
                        </Text>

                        <Text
                            color={"text.300"}
                            fontWeight={700}
                            fontSize={"2xl"}>
                            {companyName}
                        </Text>
                    </Flex>
                    <Text
                        lineHeight={"1.5"}
                        color={"text.200"}
                        fontSize={{
                            base: "md",
                            md: "lg",
                            
                        }}
                        fontWeight={300}>
                        {description}
                    </Text>
                </Flex>
                <GridItem>
                </GridItem>
            </Grid>
        </>)
}
