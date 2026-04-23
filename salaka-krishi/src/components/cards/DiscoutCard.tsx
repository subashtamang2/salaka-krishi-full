import { Flex, Text } from "@chakra-ui/react";
import type { Countdown } from "@src/schema/schema";
interface CoundownCardProps {
    data: Countdown,
}

export default function DiscountCard({ data }: CoundownCardProps) {
    return (
        <>
            <Flex
                justifyContent={"center"}
                alignItems={"center"}
                height={"59px"}
                width={"59px"}
                bg={"primary.100"}>
                <Text
                    fontWeight={600}
                    color={"secondary.200"}>
                    {data.days}
                </Text>
            </Flex>


        </>)
}
