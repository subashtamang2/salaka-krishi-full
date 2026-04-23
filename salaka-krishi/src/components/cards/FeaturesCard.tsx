import { Flex, Text, Image, Heading } from "@chakra-ui/react";
import type { FeatureItem } from "@src/schema/schema";

interface FeatureCardProps {
    data: FeatureItem;
}

export default function FeatureCard({ data }: FeatureCardProps) {

    return (
        <Flex
            direction="column"
            align="center"
            textAlign="center"
            gap={3}>
            <Flex
                height="35px"
                width="59px">
                <Image
                    src={data.icon}
                    height={"full"}
                    width={"full"}
                    objectPosition={"top"}
                    objectFit={"contain"}
                    alt={data.title} />
            </Flex>

            <Heading
                color={"secondary.100"}
                fontWeight="500"
                fontSize="2xl">
                {data.title}
            </Heading>

            <Text
                fontSize="md"
                fontWeight={400}
                color="text.100">
                {data.subtitle}
            </Text>
        </Flex>
    );
}
