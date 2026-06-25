import { Flex } from "@chakra-ui/react";
import ContentBlock from "@src/components/common/Content";
import CustomContainer from "@src/components/common/CustomContainer";
import { useQuery } from "@tanstack/react-query";
import { getTermsAndConditions } from "@src/api/static-page";
import { type DataWrapper, type staticPageContent } from "@src/schema/schema";
import SEOContent from "@src/components/SEOContent";
import StaticPageLoading from "../Loadings/StaticPageLoading";

export default function TermsAndConditions() {
    const { data: termsData, isLoading } = useQuery<DataWrapper<staticPageContent>>({
        queryKey: ['terms-and-conditions'],
        queryFn: async () => {
            const res = await getTermsAndConditions();
            return res.data;
        },
    });

    const content = termsData?.data?.content || "";
   
    console.log("TERMS CONTENT:", content);

    return (
        <>
            <SEOContent title="Terms and Conditions" />
            <CustomContainer py={14}>

                {isLoading ? (
                    <StaticPageLoading />
                ) : (
                    <Flex flexDir="column" minH="50vh">
                        <ContentBlock
                            data={content}
                            textStyle="textBordered"
                        />
                    </Flex>
                )}
            </CustomContainer>
        </>
    );
}
