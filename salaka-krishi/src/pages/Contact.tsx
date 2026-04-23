import {
    Grid,
    GridItem,
    Heading,
    Text,
    Flex,
} from "@chakra-ui/react";
import bgImage from "@assets/images/contact/banner.png";
import SecondaryBanner from "@src/components/common/SecondaryBanner";
import CustomContainer from "@src/components/common/CustomContainer";
import ContactForm from "@src/components/ContactForm";
import ContactInfoList from "@src/components/ContactInfoList";

export default function Contact() {
    return (
        <>
            <SecondaryBanner
                title="Contact"
                backgroundImage={bgImage} />
            <Flex
                flexDir={"column"}>
                <CustomContainer>
                    <Grid

                        templateColumns={{
                            base: "1fr",
                            md: "1fr ",
                            xl: "1fr 1fr"

                        }}
                        gap={{
                            base: 20,
                            md: 8,
                            lg: 6
                        }}
                        py={{ base: 16 }}>

                        <GridItem>
                            <Flex


                                direction="column"
                                gap={{
                                    base: 12,
                                    md: 12,
                                }}
                                p={{
                                    base: 2,
                                    md: 4,
                                    lg: 6
                                }}>
                                <Heading
                                    fontWeight={700}
                                    color={"primary.100"}

                                    fontSize={{
                                        base: "3xl",

                                    }}>
                                    Contact
                                    <Text
                                        color={"primary.300"}
                                        as="span"
                                        fontSize={{
                                            base: "3xl",

                                        }}>
                                        {" "} Us
                                    </Text>
                                </Heading>

                                <Text
                                    textStyle={"contactDesc"}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Bibendum est ultricies integer quis. Iaculis urna id volutpat lacus laoreet. Mauris vitae ultricies leo integer malesuada. Ac odio tempor orci dapib Fusce id velit ut tortor pretium. Massa ultricies mi quis hendrerit dolor magna eget. Nullam eget felis eget nunc lobortis. Faucibus ornare suspendisse sed nisi.
                                </Text>

                                <Flex gap={{
                                    base: 2,
                                    md: 4
                                }}>
                                    <ContactInfoList />
                                </Flex>

                            </Flex>
                        </GridItem>

                        <GridItem
                            bg={"white"}
                            p={{
                                base: 2,
                                md: 4,
                                lg: 6
                            }}
                            borderRadius="xl">
                            <Heading
                                pb={{
                                    base: 10,
                                    md: 8
                                }}
                                color={"primary.300"}

                                fontSize={{
                                    base: "3xl",
                                }}>
                                We’d love to hear from you!{" "}
                                <Text as="span"
                                    color={"primary.100"}
                                    display={{
                                        base: "inline-block",
                                        md: "block",
                                    }}
                                    mt={2}>
                                    Let's get in touch</Text>
                            </Heading>
                            <ContactForm />
                        </GridItem>
                    </Grid>
                </CustomContainer>
                <Flex
                    w="full"
                    h={{
                        base: "40vh",
                        sm: "45vh",
                        md: "55vh",
                        lg: "70vh"
                    }} >
                    <iframe
                        title="Yaks Films Production"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        style={{ border: 0 }}
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3530.968580943321!2d85.41840127546887!3d27.74911507615862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b9f4d8e07b1%3A0x3c50e55eb6a8a4d5!2sSalaka%20krishi%20limited%20Kathmandu!5e0!3m2!1sen!2snp!4v1766317630366!5m2!1sen!2snp"
                        allowFullScreen
                    />
                </Flex>
            </Flex>
        </>
    );
}
