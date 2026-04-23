import {
    Box,
    Flex,
    Grid,
    GridItem,
    Image,
    Link,
    Text
} from "@chakra-ui/react";
import CustomContainer from "../CustomContainer";
import { paymentMethods } from "@src/data/PaymentMethod";
import SocialMediaList from "../SocialMediaList";
import { FooterNav, SupportNav } from "@src/data/FooterNav";
import { useSiteInfo } from "@src/store/useSiteInfo";
import NewsletterContainer from "./NewsletterContainer";
import { getImageSrc } from "@src/utils/image";

export default function FooterTop() {
    const siteInfo = useSiteInfo((state) => state.siteInfo);

    return (
        <Box
            as="footer"
            bg="primary.100/10"
            py={10}>
            <CustomContainer>
                <Grid
                    gridTemplateColumns={{
                        base: "1fr",
                        md: "100%",
                        lg: "40% 55%",
                        xl: "25% 70%"
                    }}
                    justifyContent={"space-between"}
                    gap={8}
                    py={8}>
                    <GridItem>
                        <Flex
                            flexDir={"column"}
                            justifyContent={"center"}
                            h={"100%"}
                            w={{
                                sm: "80%",
                                md: "70%",
                                lg: "100%"
                            }}>
                            <Flex
                                alignItems={"start"}
                                mb={8}
                                w={"50%"}>
                                <Image
                                    src={getImageSrc(siteInfo?.logoUrl) || undefined}
                                    h={"100%"}
                                    w={"100%"}
                                    objectFit={"cover"}
                                    alt={siteInfo?.name} />
                            </Flex>
                            <Text

                                mb={6}>{siteInfo?.description} </Text>
                            <SocialMediaList />
                        </Flex>
                    </GridItem>
                    <Grid
                        gap={{
                            base: 8,
                            sm: 8,
                            md: 8,
                            lg: 8,
                            xl: 0
                        }}
                        gridTemplateColumns={{
                            md: "100%",
                            lg: "100%",
                            xl: "65% 35%",
                        }}>
                        <GridItem>
                            <Grid
                                gap={4}
                                gridTemplateColumns={{
                                    base: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(2, 1fr)",
                                    lg: "repeat(2, 1fr)",
                                    xl: "repeat(2, 1fr)"
                                }}>
                                <GridItem>

                                    <Flex flexDir={"column"}>
                                        {
                                            FooterNav.map(item => <Link href={item.href}
                                                key={item.id}
                                                _focus={{
                                                    outline: "none",
                                                }}

                                                mb={2}
                                                fontSize={"md"}
                                                color={"text.400"}
                                                _hover={{
                                                    color: "primary.400",
                                                    textDecoration: "none"
                                                }}>{item.label}</Link>)
                                        }
                                    </Flex>
                                </GridItem>
                                <GridItem>
                                    <Flex flexDir={"column"}>
                                        {
                                            SupportNav.map(item => <Link href={item.href}
                                                _focus={{
                                                    outline: "none",
                                                }}

                                                key={item.id}
                                                mb={2}
                                                fontSize={"md"}
                                                color={"text.400"}
                                                _hover={{
                                                    color: "primary.400",
                                                    textDecoration: "none"
                                                }}>{item.label}</Link>)
                                        }
                                    </Flex>
                                </GridItem>
                            </Grid>
                        </GridItem>
                        <GridItem>
                            <NewsletterContainer />
                            <Flex
                                gap={2}>
                                {
                                    paymentMethods.map((method) =>
                                        <Flex key={method.id}
                                            alignItems={"center"}
                                            w={"82px"}
                                            h={"42px"}
                                            justifyContent={"center"}>
                                            <Image
                                                src={method.icon}
                                                objectFit={"contain"}
                                                objectPosition={"center"}
                                                h={"full"}
                                                w={"full"} />
                                        </Flex>
                                    )
                                }
                            </Flex>
                        </GridItem>
                    </Grid>
                </Grid>
            </CustomContainer>
        </Box>
    )
}
