import {
    Box,
    Button,
    Flex,
    Heading,
    PinInput,
    Stack,
    Text,
    HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { verifyOtp, resendOtp } from "@src/api/auth";
import { toaster } from "@src/components/ui/toaster";
import routes from "@src/router/routes";


export default function VerifyOTP() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [isExpired, setIsExpired] = useState(false);

    const email = state?.email;

    useEffect(() => {
        if (!email) {
            navigate(routes.auth.base + "/" + routes.auth.register);
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [email, navigate]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const verifyMutation = useMutation({
        mutationFn: async (payload: { email: string; otp: string }) => {
            const res = await verifyOtp(payload);
            return res.data;
        },
        onSuccess: () => {
            toaster.create({
                title: "Account verified",
                description: "Account created successfully! Please login to continue.",
                type: "success",
            });
            navigate(routes.auth.base);
        },
        onError: (error: any) => {
            toaster.create({
                title: "Verification failed",
                description: error?.response?.data?.message || "Verification failed",
                type: "error",
            });
        },
    });

    const resendMutation = useMutation({
        mutationFn: async (payload: { email: string }) => {
            const res = await resendOtp(payload);
            return res.data;
        },
        onSuccess: () => {
            setTimer(300);
            setIsExpired(false);
            setOtp("");
            toaster.create({
                title: "OTP Resent",
                description: "OTP resent successfully!",
                type: "success",
            });
        },
        onError: (error: any) => {
            toaster.create({
                title: "Resend failed",
                description: error?.response?.data?.message || "Failed to resend OTP",
                type: "error",
            });
        },
    });

    const handleVerify = () => {
        if (otp.length !== 6) {
            toaster.create({
                title: "Invalid OTP",
                description: "Please enter 6-digit OTP",
                type: "warning",
            });
            return;
        }
        verifyMutation.mutate({ email, otp });
    };

    const handleResend = () => {
        resendMutation.mutate({ email });
    };

    return (
        <Flex align="center" justify="center" minH="60vh">
            <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
                <Stack gap={6} align="center">
                    <Heading size="lg" color="primary.300">Verify Your Account</Heading>
                    <Text textAlign="center">
                        We've sent a 6-digit code to <Text as="span" fontWeight="bold">{email}</Text>.
                        Please enter it below to verify your account.
                    </Text>

                    <HStack>
                        <PinInput.Root
                            value={otp.split("")}
                            onValueChange={(e) => setOtp(e.value.join(""))}
                            disabled={verifyMutation.isPending}
                        >
                            <HStack>
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <PinInput.Input key={index} index={index} />
                                ))}
                            </HStack>
                        </PinInput.Root>
                    </HStack>

                    <Box textAlign="center">
                        {isExpired ? (
                            <Text color="red.500" fontWeight="bold">OTP expired</Text>
                        ) : (
                            <Text color="muted.600">Expires in: <Text as="span" color="primary.300" fontWeight="bold">{formatTime(timer)}</Text></Text>
                        )}
                    </Box>

                    <Button
                        onClick={handleVerify}
                        loading={verifyMutation.isPending}
                        disabled={isExpired || otp.length !== 6}
                        width="full"
                        bg="primary.300"
                        color="white"
                        _hover={{ bg: "primary.400" }}
                    >
                        Verify Code
                    </Button>

                    <Flex direction="column" align="center" gap={2}>
                        <Text fontSize="sm">Didn't receive the code?</Text>
                        <Button
                            variant="ghost"
                            size="sm"
                            color="primary.300"
                            onClick={handleResend}
                            loading={resendMutation.isPending}
                        >
                            Resend Code
                        </Button>
                    </Flex>
                </Stack>
            </Box>
        </Flex>
    );
}
