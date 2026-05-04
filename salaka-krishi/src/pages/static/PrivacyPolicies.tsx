import ContentBlock from "@src/components/common/Content";
import CustomContainer from "@src/components/common/CustomContainer";
import { useQuery } from "@tanstack/react-query";
import { getPrivacyPolicy } from "@src/api/static-page";
import { type DataWrapper, type staticPageContent } from "@src/schema/schema";
import { Flex } from "@chakra-ui/react";
import SEOContent from "@src/components/SEOContent";
import StaticPageLoading from "../Loadings/StaticPageLoading";

export default function PrivacyPolicies() {
    const { data: policyData, isLoading } = useQuery<DataWrapper<staticPageContent>>({
        queryKey: ['privacy-policy'],
        queryFn: async () => {
            const res = await getPrivacyPolicy();
            return res.data;
        },
    });

    const content = policyData?.data?.content || "";

    return (
        <>
            <SEOContent title="Privacy Policy" />
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
