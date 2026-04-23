import {
    Input,
    InputGroup,
    IconButton,
    Text,
    Flex,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
const TokenVerificationInput = ({ token = "ABCDE12345" }) => {
    const [showToken, setShowToken] = useState(false);
    return (
        <>
            <Flex
                flexDir={"column"}
                width={{
                    base: "100%",
                    md: "45%",
                    lg: "100%",
                    xl: "90%",
                    "2xl": "70% ",
                }}>
                <InputGroup
                    startElement={
                        <Text
                            fontSize="sm"
                            fontWeight={400}
                            color="primary.100">
                            Token verified :
                        </Text>}
                    endElement={
                        <IconButton
                            aria-label="Toggle Token Visibility"
                            variant="ghost"
                            color={"primary.100"}
                            size="sm"
                            onClick={() => setShowToken((prev) => !prev)}>
                            {showToken ? <FiEyeOff /> : <FiEye />}
                        </IconButton>}>
                    <Input
                        w="100%"
                        ps={{
                            base: "120px",
                            md: "140px"
                        }}
                        border="2px dashed"
                        borderColor="primary.100"
                        borderRadius="md"
                        value={showToken ? token : "XXXXX"}
                        disabled
                        fontWeight="semibold"
                        color="primary.100" />
                </InputGroup>
            </Flex>
        </>
    );
};

export default TokenVerificationInput;
