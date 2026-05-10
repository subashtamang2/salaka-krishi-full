
import {
    Button,
    Flex,
    Heading,
    Input
} from "@chakra-ui/react";
import { toaster } from "../../ui/toaster";
import { subscribeNewsletter } from "@src/api/newsletter";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function NewsletterContainer() {
    const [email, setEmail] = useState<string | null>(null);

    const mutateNewsletter = useMutation({
        mutationFn: async (email: string) => {
            const rest = await subscribeNewsletter(email);
            return rest.data;
        }
    })
    const handleClick = () => {
        if (!email) {
            toaster.create({
                title: "Please enter a valid email address.",
                type: "warning",
                duration: 2000,
            })
            return;
        }
        mutateNewsletter.mutate(email, {
            onSuccess: () => {
                setEmail(null);
                toaster.create({
                    title: "Subscribed successfully!",
                    type: "success",
                    duration: 2000,
                })
            },
            onError: (error: any) => {
                const responseMessage = error?.response?.data?.message;
                let errorMessage = "Subscription failed. Please try again.";

                if (Array.isArray(responseMessage)) {
                    errorMessage = responseMessage
                        .map((err: any) => (typeof err === "object" ? err.errors : err))
                        .join(", ");
                } else if (typeof responseMessage === "string") {
                    errorMessage = responseMessage;
                }

                toaster.create({
                    title: errorMessage,
                    type: "error",
                    duration: 2000,
                })
            }
        });
    }
    return (
        <>
            <Flex
                flexDir="column"
                w={{
                    base: "100%",
                    sm: "80%",
                    md: "60%",
                    lg: "80%",
                    xl: "100%",
                }}>
                <Heading as="h4" mb={2}>
                    Newsletter
                </Heading>

                <Flex
                    gap={4}
                    position="relative"
                    mb={4}
                    direction={{
                        base: "column",
                        sm: "row"
                    }} >
                    <Input
                        name="email"
                        value={email || ""}
                        onChange={(e) => setEmail(e.target.value)}
                        color="text.400/70"
                        autoComplete="email"
                        borderColor="primary.100"
                        borderWidth="1px"
                        placeholder="Your email"
                        pr={{
                            base: "0",
                            sm: "100px"
                        }}
                        flex={1}
                        py={2}/>
                    <Button
                        onClick={handleClick}
                        position={{
                            base: "relative",
                            sm: "absolute"
                        }}
                        right={0}
                        top={0}
                        py={2}
                        bg="primary.100"
                        color="white"
                        w={{
                            base: "full",
                            sm: "auto"
                        }}
                        fontWeight={400}
                        fontSize="sm"
                        px={2}
                        _focus={{ outline: "none" }}
                        _hover={{ bg: "primary.300" }}>
                        Send
                    </Button>
                </Flex>
            </Flex>
        </>
    );
}
