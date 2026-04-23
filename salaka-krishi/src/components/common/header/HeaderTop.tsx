import { Box, Flex, Icon, Link, Text } from "@chakra-ui/react";
import CustomContainer from "../CustomContainer";
import { FaPhoneAlt } from "react-icons/fa";
import { IoCaretDownSharp } from "react-icons/io5";
import { useSiteInfo } from "@src/store/useSiteInfo";

export default function HeaderTop() {
    const siteInfo = useSiteInfo((state) => state.siteInfo);
    const phone = siteInfo?.phone || "+019003467653";

    return (
        <>
            <Flex py={2}
                borderBottomColor={"primary.100/30"}
                borderBottomWidth={1}
                flexDir={"column"}>
                <CustomContainer>
                    <Flex
                        display={{
                            base: "none",
                            md: "flex",
                        }}
                        alignItems={{
                            base: "start",
                            md: "center"
                        }}
                        justifyContent={"space-between"}
                        flexDir={{ base: "column", sm: "row" }}
                        gap={2}>

                        <Box>
                            <Flex gap={4}

                                alignItems="center"
                                justifyContent={{
                                    base: "center",
                                    sm: "flex-start"
                                }}>
                                <Flex color={"primary.100"}>
                                    <FaPhoneAlt /></Flex>
                                <Text
                                    textAlign={"left"}
                                    color={"primary.200"}
                                    fontSize={{ base: "sm", md: "md" }}>Call Us:
                                    <Link color={"primary.200"}
                                        _focus={{ outline: "none" }}
                                        href={`tel:${phone}`}
                                        ml={1}>
                                        {phone}
                                    </Link>
                                </Text>
                            </Flex>
                        </Box>


                        <Box >
                            <Flex gap={8} justifyContent={{ base: "center", sm: "end" }}>
                                <Flex justifyContent={"center"} alignItems={"center"}>
                                    <Text color={"primary.200"} fontSize={{ base: "sm", md: "md" }}>Nep</Text>
                                    <Icon as={IoCaretDownSharp} color={"primary.100"} />
                                </Flex>

                                <Flex justifyContent={"center"} alignItems={"center"}>
                                    <Text color={"primary.200"} fontSize={{ base: "sm", md: "md" }}>Language</Text>
                                    <Icon as={IoCaretDownSharp} color={"primary.100"} />
                                </Flex>
                            </Flex>
                        </Box>


                    </Flex>
                </CustomContainer>
            </Flex>

        </>)
}
