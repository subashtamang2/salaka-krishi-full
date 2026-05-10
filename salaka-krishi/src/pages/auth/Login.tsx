import {
    Flex,
    Heading,
    Link,
    Text
} from "@chakra-ui/react";
import { useEffect } from "react";
import { LoginAPI } from "@src/api/auth";
import Auth from "@src/components/cards/Auth";

import CustomContainer from "@src/components/common/CustomContainer";
import routes from "@src/router/routes";
import { useMutation } from "@tanstack/react-query";
import {
    FaGoogle
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router";
import LoginForm from "./LoginForm";
import { toaster } from "@src/components/ui/toaster";


export type AuthMethod = "google";
export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            toaster.create({
                title: "Access Denied",
                description: error,
                type: "error",
            });
            // Clear the error from URL
            navigate(routes.auth.base, { replace: true });
        }
    }, [searchParams, navigate]);

    const { mutate } = useMutation({
        mutationFn: async (method: AuthMethod) => {
            const res = await LoginAPI(method);
            return res.data;
        },
        onSuccess: (data) => {
            if (data?.data) {
                window.location.href = data.data;
            }
        }
    });


    const authMethod = [

        {
            id: 1,
            name: "Google",
            icon: <FaGoogle />,
            handleClick: () => mutate("google")

        },

    ];
    return (

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
                flexDir={"column"}>
                <Heading as={"h2"}
                    color={"text.600"}
                    fontWeight={"600"}
                    fontFamily={"poppins"}
                    fontSize={"3xl"}>Welcome Back</Heading>
                <Text
                    color={"primary.300"}
                    fontFamily={"poppins"}
                    fontWeight={"500"}
                    fontSize={"lg"}>Login to continue</Text>
            </Flex>
            <Flex
                gap={6}
                flexDirection={"column"}>
                <LoginForm />
                <Flex
                    fontWeight={700}
                    fontSize={"lg"}
                    alignItems={"center"}
                    position={"relative"}
                    justifyContent={"center"}
                    _after={{
                        content: '""',
                        position: "absolute",
                        width: "100%",
                        height: "1px",
                        bg: "text.600/9",
                    }}>
                    <Text
                        fontWeight={600}
                        px={3}
                        fontFamily={"poppins"}
                        color={"primary.300"}
                        bg="background.300/6"
                        position={"relative"}
                        zIndex={1} as={"span"}>OR</Text>
                </Flex>
                <Flex
                    gap={3}
                    mb={4}
                    flexDir={"column"}>
                    {

                        authMethod.map(m => <Auth key={m.id} method={m} />)
                    }
                </Flex>
            </Flex>

            <Flex
                textAlign={"center"}
                color={"text.700"}
                fontWeight={"500"}
                fontSize={"lg"}>Or create an {" "}<Link
                    fontWeight={700}
                    fontFamily={"poppins"}
                    _hover={{
                        textDecoration: "none",
                    }}
                    _focus={{
                        outline: "none",
                    }}
                    color={"text.800"}
                    onClick={() => navigate(`${routes.auth.base}/${routes.auth.register}`)}>account</Link>
            </Flex>
        </CustomContainer>

    )
}
