import TestimonialSlider from "./TestimonialSlider";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { DataWrapper } from "@src/schema/schema";
import ProductRow from "@src/pages/Loadings/ProductRow";
import useIsVisible from "@src/utils/useIsVisible";
import { getClientReviews } from "@src/api/clientReviews";
import CustomContainer from "@src/components/common/CustomContainer";
import type { ClientReviews } from "@src/schema/review";


export default function Index() {
    const {
        isVisible, ref
    } = useIsVisible<HTMLDivElement>();
    const { data, isLoading, isError } = useQuery<DataWrapper<ClientReviews[]>>({
        queryKey: ["client-reviews"],
        queryFn: async () => {
            const res = await getClientReviews();
            return res.data;
        },
        enabled: !!isVisible,
    });
    if (isLoading) return <ProductRow />;
    if (isError) return null;
    const reviews = data?.data || [];
    return (
        <Flex ref={ref}
            flexDir={"column"}>
            <CustomContainer py={20}>
                <Heading
                    mb={10}
                    fontSize={"3xl"}
                    fontWeight={600}
                    textAlign={"center"}
                    color={"primary.100"}>
                    Testimonial
                </Heading>

                <Box
                    pos={"relative"} pt={{ base: 6, md: 10 }}>
                    <TestimonialSlider reviews={reviews} />
                </Box>
            </CustomContainer >
        </Flex>
    )
}
