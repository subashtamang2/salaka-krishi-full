import { Flex, Text } from "@chakra-ui/react";
import ReviewRating from "../../Rating";
import type { ReviewSchema } from "@src/schema/schema";

interface ReviewCardProps {
    person: ReviewSchema,

}

export default function ReviewCard({ person }: ReviewCardProps) {
    return (
        <>
            <Flex
                py={6}
                px={8}
                flexDir={"column"}
                bg={"background.300/2"}
                gap={2}
                border="1px solid transparent"
                shadow={"green.150"}
                transition="all 0.5s ease"
                _hover={{
                    bg: "secondary.200",
                    borderWidth: 1,
                    borderColor: "primary.100",
                    shadow: "green.100"

                }}
                borderTopRightRadius={"40px"}
                borderBottomLeftRadius={"40px"}>
                <Text
                    fontSize={"xl"}
                    fontWeight={500}
                    color={"primary.300/"}>
                    {person.name}
                </Text>
                <Text
                    fontSize={"md"}
                    fontWeight={"300"}
                    color={"text.200"}>
                    {person.date}
                </Text>
                <ReviewRating
                    readOnly={true}
                    rating={person.rating} />
                <Text fontSize={"md"}
                    fontWeight={"300"}
                    color={"text.200"}>
                    {person.message}
                </Text>

            </Flex>


        </>)
}
