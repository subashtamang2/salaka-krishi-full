import {
    Box,
    Flex,
    Heading,
    Text,
} from "@chakra-ui/react";

interface ShippingCardProps {
    label: {
        title: string;
        description: string;
    };
    isChecked?: boolean;
    onSelect?: () => void;
}

export default function ShippingCard({ label, isChecked, onSelect }: ShippingCardProps) {
    return (
        <Box
            as="button"
            onClick={onSelect}
            cursor="pointer"
            width="full"
            textAlign="left"
            alignItems="center"
            display="flex"
            gap={{ base: 3, sm: 4 }}
            px={{ base: 3, sm: 5 }}
            py={{ base: 3, sm: 4 }}
            borderWidth="2px"
            borderColor={isChecked ? "orange.400" : "gray.200"}
            borderRadius="md"
            bg={isChecked ? "orange.50" : "white"}
            _hover={{ borderColor: "orange.300" }}
            transition="all 0.2s"
        >
            <Box
                w={{ base: 5, sm: 5 }}
                h={{ base: 5, sm: 5 }}
                borderRadius="full"
                borderWidth="2px"
                borderColor={isChecked ? "orange.400" : "gray.300"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={isChecked ? "orange.400" : "white"}
            >
                {isChecked && (
                    <Box 
                        w="8px" 
                        h="8px" 
                        borderRadius="full" 
                        bg="white" 
                    />
                )}
            </Box>
            <Flex flexDir="column">
                <Heading
                    as="h4"
                    fontSize={"lg"}
                    fontWeight="500"
                >
                    {label.title}
                </Heading>
                <Text
                    fontSize={"md"}
                    fontWeight="500"
                >
                    {label.description}
                </Text>
            </Flex>
        </Box>
    );
}
