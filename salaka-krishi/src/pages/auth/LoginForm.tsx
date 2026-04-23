import {
    Box,
    Button,
    Flex,
    IconButton,
    Input,
    InputGroup,
    Stack,
    Field,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdLockOutline, MdOutlineEmail } from "react-icons/md";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@src/api/auth";
import type { SignInProps } from "@src/schema/schema";
import { toast } from "react-toastify";
import { setAccessToken, setRefreshToken } from "@src/utils/local-storage";




interface LoginFormProps {
    onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInProps>();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const { mutate } = useMutation({
        mutationFn: async (payload: SignInProps) => {
            const res = await signIn(payload);
            return res.data;
        },
        onSuccess: (data) => {
            const { access_token, refresh_token } = data?.data;
            setAccessToken(access_token);
            setRefreshToken(refresh_token)
            toast.success("You've successfully Logged In!");
            if (onSuccess) {
                onSuccess();
            } else {
                navigate(from, { replace: true });
            }
        },
        // onError: () => {
        //     toast.error("An error occurred. Please try again.");
        // }

        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                "Something went wrong";

            toast.error(message);
        }
    });
    const onSubmit = (data: SignInProps) => {
        mutate(data);
    };

    return (
        <Box w="full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={4} >
                    <Field.Root invalid={!!errors.email}>
                        <InputGroup startElement={<MdOutlineEmail color="muted.700" />}>
                            <Input
                                variant={"outline"}
                                placeholder="Email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value:
                                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address",
                                    },
                                })}
                            />
                        </InputGroup>
                        <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.password}>
                        <InputGroup
                            startElement={<MdLockOutline color="muted.700" />}
                            endElement={
                                <IconButton
                                    aria-label="Toggle Password Visibility"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowPassword((prev) => !prev)}>
                                    {showPassword ? <FiEye /> : <FiEyeOff />}
                                </IconButton>
                            }>
                            <Input
                                variant={"outline"}
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                {...register("password", { required: "Password is required" })}
                            />
                        </InputGroup>
                        <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                    </Field.Root>

                    <Flex>
                        <Button
                            width={"full"}
                            type="submit"
                            px={10}
                            py={5}
                            fontSize="lg"
                            fontWeight={500}
                            fontFamily={"poppins"}
                            _hover={{
                                bg: "primary.300"
                            }} >
                            Sign In
                        </Button>
                    </Flex>
                </Stack>
            </form>
        </Box>
    );
}
