import {
Flex,
 Link,
 Text,
 Center
 } from "@chakra-ui/react";
import FaqCard from "@src/components/cards/FaqCard";
import CustomContainer from "@src/components/common/CustomContainer";
import { EMAIL, PHONE } from "@src/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { getFaq } from "@src/api/faq";
import type { DataWrapper } from "@src/schema/schema";
import type { FaqResponse } from "@src/schema/faq";
import { useSiteInfo } from "@src/store/useSiteInfo";
import StaticPageLoading from "../Loadings/StaticPageLoading";

export default function OrderAndReturn() {
    const siteInfo = useSiteInfo((state) => state.siteInfo);
    const phone = siteInfo?.phone || PHONE;
    const email = siteInfo?.email || EMAIL;

    const { data: faqResponse, isLoading, isError } = useQuery<DataWrapper<FaqResponse[]>>({
        queryKey: ["faqs"],
        queryFn: () => getFaq().then(res => {
            console.log("FAQ API Raw Response:", res.data);
            return res.data;
        }),
    });

    const faqGroups = faqResponse?.data || [];
    const orderFaqs = faqGroups.find(g => g.category.toLowerCase() === "order")?.faqs || [];
    const returnFaqs = faqGroups.find(g => g.category.toLowerCase() === "returns" || g.category.toLowerCase() === "return")?.faqs || [];

    return (
        <>
            <CustomContainer py={28}>
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

                    {isLoading ? (
                        <StaticPageLoading />
                    ) : isError ? (
                        <Center py={10}>
                            <Text color="red.500">Error loading FAQs. Please try again later.</Text>
                        </Center>
                    ) : (
                        <>
                            {orderFaqs.length > 0 && (
                                <FaqCard
                                    data={orderFaqs}
                                    heading="Order" />
                            )}
                            {returnFaqs.length > 0 && (
                                <FaqCard
                                    data={returnFaqs}
                                    heading="Return" />
                            )}
                        </>
                    )}

                    <Text
                        color={"primary.100"}
                        fontFamily={"robotoSlab"}
                        fontWeight={400}
                        fontSize={"lg"}>Can't find an answer?  Call us <Link href={`tel:${phone}`} color={"primary.300"} fontSize={"lg"} textDecoration={"underline"}>{phone}</Link> or email <Link href={`mailto:${email}`} color={"primary.300"} fontSize={"lg"} textDecoration={"underline"}>{email}</Link></Text>
                </Flex>
            </CustomContainer>
        </>
    );
}
