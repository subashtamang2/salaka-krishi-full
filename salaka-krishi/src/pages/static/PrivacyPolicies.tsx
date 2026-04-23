import ContentBlock from "@src/components/common/Content";
import CustomContainer from "@src/components/common/CustomContainer";
import { useQuery } from "@tanstack/react-query";
import { getPrivacyPolicy } from "@src/api/static-page";
import { type DataWrapper, type staticPageContent } from "@src/schema/schema";
import { Flex, Spinner, Center } from "@chakra-ui/react";
import SEOContent from "@src/components/SEOContent";

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
                    <Center py={20}>
                        <Spinner size="xl" color="primary.100" />
                    </Center>
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
