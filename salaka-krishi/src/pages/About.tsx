import SecondaryBanner from "@src/components/common/SecondaryBanner";
import bgimage from "@assets/images/about/banner.png";
import { Flex, Heading, Text } from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";
import { IntroDesc } from "@src/data/About";
import CompanyOverViewCard from "@src/components/cards/CompanyOverViewCard";
import profileImage from "@assets/images/about/profile.png";
import OurVisionCard from "@src/components/cards/OurVisionCard";
import MissionCard from "@src/components/cards/MissionCard";
import backgroundImage from "@assets/images/about/background.png";
import Index from "@src/theme/components/testimonial";

export default function About() {
    return (
        <>
            <SecondaryBanner
                backgroundImage={bgimage}
                title="About" />
            <Flex flexDir={"column"}
            >
                <CustomContainer py={12}>
                    <Flex flexDir={"column"} gap={20}>
                        <Flex flexDir={"column"} gap={8}>
                            <Heading
                                textStyle={"title1"}
                            >Introduction
                            </Heading>
                            <Text
                                lineHeight={"1.5"}
                                color={"text.200"}
                                fontSize={{
                                    base: "md",
                                    md: "lg"
                                }}
                                fontWeight={300}>
                                {IntroDesc.desc}
                            </Text>
                        </Flex>
                        <Flex flexDir={"column"}>

                            <CompanyOverViewCard
                                ceoName="Mr. Ang Phurba Sherpa"
                                ceoTitle="CEO"
                                companyName="Salaka Krishi Limited"
                                image={profileImage}
                                description="Organic Farming Enterprise Gokarneshwor, Kathmandu Founded in 2070 B.S., Salaka Krishi Limited is a vertically integrated organic farming company committed to delivering fresh, chemical-free agricultural products directly to consumers. Rooted in the principles of sustainability and purity, our farm-to-consumer model ensures traceability, freshness, and trust in every Salaka Krishi Limited is a vertically integrated organic farming company committed to delivering fresh, chemical-free agricultural products Salaka Krishi Limited .directly to consumers.product......see more" />
                        </Flex >
                    </Flex>
                </CustomContainer>
                <CustomContainer
                    bg={"background.300/5"}
                    py={20}>

                    <MissionCard />
                </CustomContainer>





                <OurVisionCard
                    backgroundImage={backgroundImage}
                    title="OUR VISION & GOAL"
                    subtitle="SALAKA KRISHI LIMITED CULTIVATING A SUSTAINABLE FUTURE"
                    description="Salaka Krishi Limited is a forward-thinking agricultural company dedicated to promoting organic and eco-friendly farming in Nepal. Established with a vision to provide healthy, sustainable, and high-quality produce, we integrate modern agricultural techniques with traditional knowledge to benefit both people and the planet. Our mission is to empower local farmers through training and collaboration, encourage responsible use of natural resources, and deliver safe, traceable, and eco-conscious products to every household."
                />
                <Index/>

            </Flex>

        </>
    )
}
