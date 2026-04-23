import {
    Box,
    Portal,
    Flex,
    CloseButton,
} from "@chakra-ui/react";
import { useAuthModalStore } from "@src/store/useAuthModalStore";
import AuthContainer from "./AuthContainer";
import { useState, useEffect } from "react";

export default function AuthModal() {
    const { isOpen, closeModal, onSuccess } = useAuthModalStore();
    const [view, setView] = useState<"login" | "register">("login");

    // Reset view to login when modal opens
    useEffect(() => {
        if (isOpen) {
            setView("login");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSuccess = () => {
        closeModal();
        if (onSuccess) onSuccess();
    };

    const getHeaderTitle = () => {
        return view === "login" ? "Login to continue" : "Create Account";
    };

    return (
        <Portal>
            <Box
                position="fixed"
                inset={0}
                bg="rgba(0, 0, 0, 0.6)"
                zIndex={9999}
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={{ base: 4, md: 0 }}>
                <Box
                    bg="white"
                    maxW="lg"
                    w="full"
                    borderRadius="md"
                    overflow="hidden"
                    position={"relative"}
                    boxShadow="2xl">
                    <Box
                        bg="primary.100/10"
                        color="black.400"
                        p={6}
                        textAlign="center"
                        fontSize="2xl"
                        fontFamily={"primary"}
                        fontWeight={600}>
                        {getHeaderTitle()}
                    </Box>
                    <Flex
                        flexDir={"column"}
                        position={"absolute"}
                        top={{ base: 2, md: 4 }}
                        right={{ base: 2, md: 4 }}>
                        <CloseButton
                            size={{ base: "md", md: "lg" }}
                            _hover={{ bg: "transparent" }}
                            onClick={closeModal}
                            cursor="pointer"
                        />
                    </Flex>
                    <Box>
                        <AuthContainer 
                            onSuccess={handleSuccess} 
                            initialView={view} 
                        />
                    </Box>
                </Box>
            </Box>
        </Portal>
    );
}
