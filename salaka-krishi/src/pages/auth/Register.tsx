import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";
import routes from "@src/router/routes";
import CreateAccountForm from "./CreateAccountForm";
export default function Register() {
    return (
        <>
                <CustomContainer
                    w={{
                        base: "100%",
                        md: "75%",
                        lg: "60%",
                        xl: "48%",
                        "2xl": "40%"
                    }}
                    py={20}>
                    <Flex
                        mb={8}
                        gap={1}
                        flexDir={"column"}>
                        <Heading as={"h2"}
                            fontWeight={"600"}
                            color={"muted.900"}
                            fontFamily={"poppins"}
                            fontSize={"2xl"}>Create Account</Heading>
                        <Text
                            color={"primary.300"}
                            fontWeight={"500"}
                            fontFamily={"poppins"}
                            fontSize={"lg"}>Already have an account ? <Link
                                fontWeight={500}
                                textDecoration={"underline"}
                                color={"muted.900"}
                                _focus={{
                                    outline: "none",
                                }}

                                href={routes.auth.base}>Sign In.</Link></Text>
                    </Flex>
                    <Flex>
                        <CreateAccountForm />
                    </Flex>
                </CustomContainer>

        </>
    )
}
