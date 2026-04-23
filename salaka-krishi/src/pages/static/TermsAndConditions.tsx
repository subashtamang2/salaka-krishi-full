import { Flex, Spinner, Center } from "@chakra-ui/react";
import ContentBlock from "@src/components/common/Content";
import CustomContainer from "@src/components/common/CustomContainer";
import { useQuery } from "@tanstack/react-query";
import { getTermsAndConditions } from "@src/api/static-page";
import { type DataWrapper, type staticPageContent } from "@src/schema/schema";
import SEOContent from "@src/components/SEOContent";

export default function TermsAndConditions() {
    const { data: termsData, isLoading } = useQuery<DataWrapper<staticPageContent>>({
        queryKey: ['terms-and-conditions'],
        queryFn: async () => {
            const res = await getTermsAndConditions();
            return res.data;
        },
    });

    const content = termsData?.data?.content || "";

    return (
        <>
            <SEOContent title="Terms and Conditions" />
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
