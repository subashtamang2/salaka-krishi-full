import {
    Flex,
    Text,
    Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LoginAPI } from "@src/api/auth";
import { FaGoogle } from "react-icons/fa";
import LoginForm from "@src/pages/auth/LoginForm";
import CreateAccountForm from "@src/pages/auth/CreateAccountForm";
import Auth from "@src/components/cards/Auth";

type AuthView = "login" | "register";

interface AuthContainerProps {
    onSuccess?: () => void;
    initialView?: AuthView;
}

export default function AuthContainer({ onSuccess, initialView = "login" }: AuthContainerProps) {
    const [view, setView] = useState<AuthView>(initialView);

    const googleLoginMutation = useMutation({
        mutationFn: async () => {
            const res = await LoginAPI("google");
            return res.data;
        },
        onSuccess: (data) => {
            if (data?.data) {
                window.location.href = data.data;
            }
        }
    });

    const handleLoginSuccess = () => {
        if (onSuccess) onSuccess();
    };

    const handleRegisterSuccess = () => {
        setView("login");
    };

    return (
        <Flex flexDir="column" p={6} gap={6}>
            {view === "login" && (
                <Flex flexDir="column" gap={6}>
                    <Flex flexDir="column" mb={2}>
                        <Heading as="h2" color="text.600" fontWeight="600" fontFamily="poppins" fontSize="2xl">Welcome Back</Heading>
                        <Text color="primary.300" fontFamily="poppins" fontWeight="500" fontSize="md">Login to continue</Text>
                    </Flex>

                    <LoginForm onSuccess={handleLoginSuccess} />

                    <Flex
                        fontWeight={700}
                        fontSize="md"
                        alignItems="center"
                        position="relative"
                        justifyContent="center"
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
                            fontFamily="poppins"
                            color="primary.300"
                            bg="white"
                            position="relative"
                            zIndex={1} as="span">OR</Text>
                    </Flex>

                    <Auth method={{
                        id: 1,
                        name: "Google",
                        icon: <FaGoogle />,
                        handleClick: () => googleLoginMutation.mutate()
                    }} />

                    <Text textAlign="center" fontSize="sm" color="text.700">
                        Don't have an account? <Text as="span" fontWeight={700} color="text.800" cursor="pointer" onClick={() => setView("register")}>Sign up</Text>
                    </Text>
                </Flex>
            )}

            {view === "register" && (
                <Flex flexDir="column" gap={6}>
                    <Flex flexDir="column" mb={2}>
                        <Heading as="h2" color="text.600" fontWeight="600" fontFamily="poppins" fontSize="2xl">Create Account</Heading>
                        <Text color="primary.300" fontFamily="poppins" fontWeight="500" fontSize="md">Already have an account? <Text as="span" fontWeight={700} cursor="pointer" textDecoration="underline" onClick={() => setView("login")}>Sign In</Text></Text>
                    </Flex>

                    <CreateAccountForm onSuccess={handleRegisterSuccess} />
                </Flex>
            )}
        </Flex>
    );
}
