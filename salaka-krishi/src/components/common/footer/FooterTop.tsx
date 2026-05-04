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
import logoFallback from "@assets/logo/logo.svg";

export default function FooterTop() {
    const siteInfo = useSiteInfo((state) => state.siteInfo);

    return (
        <Box as="footer" bg="primary.100/10" py={16}>
            <CustomContainer>
                {/*
                  Main Responsive Grid:
                  - base (Mobile): 1 column (stacks everything vertically)
                  - sm (Tablet): 2 columns (clean side-by-side layout)
                  - lg (Desktop): 4 columns with custom fractional widths
                */}
                <Grid
                    templateColumns={{
                        base: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "1.5fr 0.8fr 0.8fr 1.5fr" // Logo and Newsletter get more space
                    }}
                    gap={{ base: 12, lg: 8 }}
                >
                    {/* Column 1: Brand Identity & Social Links */}
                    <GridItem>
                        <Flex flexDir="column" gap={6}>
                            <Box maxW="180px">
                                <Image
                                    src={getImageSrc(siteInfo?.logoUrl) || logoFallback}
                                    h="auto"
                                    w="full"
                                    objectFit="contain"
                                    alt={siteInfo?.name || "Salaka Krishi"}
                                />
                            </Box>
                            <Text color="text.400" fontSize="md" lineHeight="tall">
                                {siteInfo?.description}
                            </Text>
                            <SocialMediaList />
                        </Flex>
                    </GridItem>


                    <GridItem>
                        <Flex flexDir="column" gap={4}>
                            {FooterNav.map(item => (
                                <Link
                                    href={item.href}
                                    key={item.id}
                                    fontSize="md"
                                    color="text.400"
                                    _focus={{ outline: "none" }}
                                    _hover={{ color: "primary.400", textDecoration: "none" }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </Flex>
                    </GridItem>


                    <GridItem>
                        <Flex flexDir="column" gap={4}>
                            {SupportNav.map(item => (
                                <Link
                                    href={item.href}
                                    key={item.id}
                                    fontSize="md"
                                    color="text.400"
                                    _focus={{ outline: "none" }}
                                    _hover={{ color: "primary.400", textDecoration: "none" }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </Flex>
                    </GridItem>


                    <GridItem>
                        <Flex flexDir="column" gap={8}>
                            <NewsletterContainer />

                            <Flex flexDir="column" gap={4}>
    
                                <Flex gap={4} flexWrap="wrap">
                                    {paymentMethods.map((method) => (
                                        <Flex
                                            key={method.id}
                                            alignItems="center"
                                            justifyContent="center"
                                            bg="white"
                                            p={1}
                                            borderRadius="md"
                                            boxShadow="sm"
                                            w="60px"
                                            h="35px"
                                        >
                                            <Image
                                                src={method.icon}
                                                objectFit="contain"
                                                h="full"
                                                w="full"
                                                alt={method.id}
                                            />
                                        </Flex>
                                    ))}
                                </Flex>
                            </Flex>
                        </Flex>
                    </GridItem>
                </Grid>
            </CustomContainer>
        </Box>
    );
}
