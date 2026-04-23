import { Flex, Text } from "@chakra-ui/react";
interface AuthProps {
    method: {
        id: number;
        name: string;
        icon: React.ReactNode;
        handleClick?: () => void;
    }
}

export default function Auth({ method }: AuthProps) {
    return (
        <>
            <Flex
                as="button"
                onClick={method.handleClick}
                justifyContent={"center"}
                alignItems={"center"}
                fontFamily={"poppins"}
                bg="transparent"
                color={"text.900"}
                borderWidth={2}
                borderColor="muted.250"
                cursor={"pointer"}
                gap={1}
                px={4}
                py={3}>
                <Flex fontSize={"lg"}>{method.icon}</Flex>
                <Text
                    fontWeight={500}>Continue with {method.name}</Text>
            </Flex>
        </>
    )
}
