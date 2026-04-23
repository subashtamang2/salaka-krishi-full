import { Flex, Heading, Link, Text, Spinner, Center } from "@chakra-ui/react";
import FaqCard from "@src/components/cards/FaqCard";
import CustomContainer from "@src/components/common/CustomContainer";
import { EMAIL, PHONE } from "@src/utils/constants";
import SearchContainer from "../SearchContainer";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFaq } from "@src/api/faq";
import type { FaqResponse } from "@src/schema/faq";
import type { DataWrapper } from "@src/schema/schema";


export default function SearchTerms() {
    const [searchQuery, setSearchQuery] = useState<string | null>(null);

    // Fetch filtered FAQs if there is a search query
    const { data: searchResponse, isLoading: isSearchLoading } = useQuery<DataWrapper<FaqResponse[]>>({
        queryKey: ["searchFaq", searchQuery],
        queryFn: () => getFaq(searchQuery).then(res => res.data),
        enabled: !!searchQuery,
    });

    // Fetch all FAQs for the default list
    const { data: allFaqResponse, isLoading: isAllLoading } = useQuery<DataWrapper<FaqResponse[]>>({
        queryKey: ["faqs"],
        queryFn: () => getFaq().then(res => res.data),
        enabled: !searchQuery,
    });

    const searchResults = searchResponse?.data?.flatMap(group => group.faqs) || [];
    const allFaqs = allFaqResponse?.data || [];
    const shippingFaqs = allFaqs.find(g => g.category.toLowerCase() === "shipping")?.faqs || [];
    const productFaqs = allFaqs.find(g => g.category.toLowerCase() === "products" || g.category.toLowerCase() === "product")?.faqs || [];

    return (
        <>

            <CustomContainer

                py={28}>
                <Flex
                    flexDir={"column"}
                    mx={{ sm: "auto" }}
                    w={{
                        base: "100%",
                        sm: "90%",
                        md: "75%",
                        lg: "80%",
                        xl: "85%"
                    }}
                    gap={8}>
                    <Heading
                        color={"primary.300"}
                        mb={3}
                        textAlign={"center"}
                        fontFamily={"primary"}
                        fontSize={"3xl"}
                        fontWeight={700}
                        as="h1">Hello, How can we help you ?
                    </Heading>
                    <SearchContainer setSearchQuery={setSearchQuery} />

                    {isSearchLoading || isAllLoading ? (
                        <Center py={10}>
                            <Spinner size="xl" color="primary.300" />
                        </Center>
                    ) : searchQuery && searchResults ? (
                        <>
                            <Heading
                                my={4}
                                color={"primary.300"}
                                fontFamily={"primary"}
                                fontSize={"2xl"}
                                fontWeight={500}
                                as="h3">
                                Search Results for "{searchQuery}"
                            </Heading>
                            {searchResults.length > 0 ? (
                                <FaqCard
                                    data={searchResults}
                                    heading="Results" />
                            ) : (
                                <Text textAlign="center" fontSize="lg" color="muted.800">
                                    No results found.
                                </Text>
                            )}
                        </>
                    ) : (
                        <>
                            <Heading
                                my={8}
                                color={"primary.300"}
                                fontFamily={"primary"}
                                fontSize={"2xl"}
                                fontWeight={500}
                                as="h3">People ask for this...
                            </Heading>
                            <FaqCard
                                data={shippingFaqs}
                                heading="Shipping" />
                            <FaqCard
                                data={productFaqs}
                                heading="Products" />
                        </>
                    )}

                    <Text
                        color={"primary.100"}
                        fontFamily={"robotoSlab"}
                        fontWeight={400}
                        fontSize={"lg"}>Can't find an answer?  Call us <Link _focus={{
                            outline: "none",
                        }}
                            href={`tel:${PHONE}`} color={"primary.300"} fontSize={"lg"} textDecoration={"underline"}>{PHONE}</Link> or email <Link _focus={{
                                outline: "none",
                            }}
                                href={`mailto:${EMAIL}`} color={"primary.300"} fontSize={"lg"} textDecoration={"underline"}>{EMAIL}</Link></Text>
                </Flex>
            </CustomContainer>


        </>

    );
}
