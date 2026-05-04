import {
 Flex,
 Link,
 Text,
 Center
} from "@chakra-ui/react";
import FaqCard from "@src/components/cards/FaqCard";
import BreadCrumb from "@src/components/common/BreadCrumb";
import CustomContainer from "@src/components/common/CustomContainer";
import { EMAIL, PHONE } from "@src/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { getFaq } from "@src/api/faq";
import type { DataWrapper } from "@src/schema/schema";
import type { FaqResponse } from "@src/schema/faq";
import StaticPageLoading from "../Loadings/StaticPageLoading";
export default function DeliveryInformation() {
    const { data: faqResponse, isLoading, isError } = useQuery<DataWrapper<FaqResponse[]>>({
        queryKey: ["faqs"],
        queryFn: () => getFaq().then(res => {
            console.log("FAQ API Raw Response:", res.data);
            return res.data;
        }),
    });

    // If the backend response is { data: { data: [...] } }, then we need to access faqResponse?.data
    // If the backend response is { data: [...] }, then faqResponse itself is the array.
    // Given DataWrapper<T> { data: T }, faqResponse is the wrapper, so faqResponse.data is T (the array).
    const faqGroups = faqResponse?.data || [];
    const shippingFaqs = faqGroups.find(g => g.category.toLowerCase() === "shipping")?.faqs || [];
    const productFaqs = faqGroups.find(g => g.category.toLowerCase() === "products" || g.category.toLowerCase() === "product")?.faqs || [];

    return (
        <>
            <CustomContainer py={14}>
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
                    <BreadCrumb />

                    {isLoading ? (
                        <StaticPageLoading />
                    ) : isError ? (
                        <Center py={10}>
                            <Text color="red.500">Error loading FAQs. Please try again later.</Text>
                        </Center>
                    ) : (
                        <>
                            {shippingFaqs.length > 0 && (
                                <FaqCard
                                    data={shippingFaqs}
                                    heading="Shipping" />
                            )}
                            {productFaqs.length > 0 && (
                                <FaqCard
                                    data={productFaqs}
                                    heading="Products" />
                            )}
                        </>
                    )}

                    <Text
                        color={"primary.100"}
                        fontFamily={"robotoSlab"}
                        fontWeight={400}
                        fontSize={"lg"}>
                        Can't find an answer?  Call us{" "}
                        <Link
                            _focus={{
                                outline: "none",
                            }}
                            href={`tel:${PHONE}`} color={"primary.300"} fontSize={"lg"} textDecoration={"underline"}>{PHONE}</Link> or email <Link _focus={{ outline: "none", }} href={`mailto:${EMAIL}`} color={"primary.300"} fontSize={"lg"} textDecoration={"underline"}>{EMAIL}</Link></Text>
                </Flex>
            </CustomContainer>
        </>
    );
}
