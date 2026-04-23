import { Flex } from "@chakra-ui/react";
import BlogSection from "@src/components/BlogSection";
import CategorySection from "@src/components/CategorySection";
import CustomContainer from "@src/components/common/CustomContainer";
import DealShowcase from "@src/components/common/DealShowCase";
import ProductsTab from "@src/components/common/ProductsTab";
import FeaturesSection from "@src/components/FeaturesSection";
import MainBanner from "@src/components/MainBanner";
import OfferCarousel from "@src/components/OfferCarousel";
import ProductListCategory from "@src/components/ProductListCategory";

export default function Home() {
    return (
        <>
            <Flex
                flexDir={"column"}>
                <MainBanner />
                <FeaturesSection />
                <CategorySection />
                <Flex
                    display={{
                        base: "none",
                        xl: "block",
                    }}
                    flexDir={"column"}
                    py={20}>
                    <OfferCarousel />
                </Flex>

                <CustomContainer py={20}>
                    <ProductsTab />
                </CustomContainer>
                <DealShowcase />

                <ProductListCategory />

                <BlogSection />

            </Flex >

        </>
    )

}
