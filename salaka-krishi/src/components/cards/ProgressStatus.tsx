import { Flex, Text } from "@chakra-ui/react";
import { Progress } from "@chakra-ui/react";

interface ProgressStatusProps {
    available: number;
    sold: number;
}

export default function ProgressStatus({ available, sold }: ProgressStatusProps) {
    const total = available + sold;
    const progressValue = total > 0 ? (sold / total) * 100 : 0;

    return (
        <Flex
            direction="column"
            gap="4"
            align="center"
            p="5">

            <Flex
                justify="space-between"
                w="100%"
                fontSize={"md"}
                color={"text.200"}>
                <Text >Available: {available}</Text>
                <Text>Already Sold: {sold}</Text>
            </Flex>

            <Progress.Root value={progressValue} w="100%">
                <Progress.Track bg="gray.200">
                    <Progress.Range bg="green.500" />
                </Progress.Track>
            </Progress.Root>

        </Flex>
    );
}
