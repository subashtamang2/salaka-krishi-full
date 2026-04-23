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
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdLockOutline, MdOutlineEmail } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import type { SignUpProps } from "@src/schema/schema";
import { toast } from "react-toastify";
import { signUp } from "@src/api/auth";
import { useNavigate } from "react-router";
import routes from "@src/router/routes";





interface CreateAccountFormProps {
    onSuccess?: () => void;
}

export default function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpProps>();
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: async (payload: SignUpProps) => {
            const res = await signUp(payload);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Account created successfully! Please login to continue.");
            if (onSuccess) {
                onSuccess();
            } else {
                navigate(routes.auth.base);
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "An error occurred. Please try again.";
            toast.error(message);
        }
        //  onError: (error: any) => {
        //             console.log("Signup Error:", error);

        //             const message =
        //                 error?.response?.data?.message ||
        //                 error?.message ||
        //                 "Something went wrong";

        //             toast.error(message);
        //         }
        //     });

    });
    const onSubmit = (data: SignUpProps) => {
        mutate(data);
    };

    return (
        <Box w="full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={4}>
                    <Field.Root invalid={!!errors.firstName}>
                        <InputGroup startElement={<FaRegUser color="muted.700" />}>
                            <Input
                                variant={"outline"}
                                placeholder="Enter your First name"
                                {...register("firstName",
                                    { required: "First name is required" })}
                            />
                        </InputGroup>
                        <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.lastName}>
                        <InputGroup startElement={<FaRegUser color="muted.700" />}>
                            <Input
                                variant={"outline"}
                                placeholder="Enter your Lirst name"
                                {...register("lastName",
                                    { required: "Last name is required" })}
                            />
                        </InputGroup>
                        <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
                    </Field.Root>

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

                    <Flex >
                        <Button
                            type="submit"
                            width={"full"}
                            px={10}
                            py={5}
                            fontSize="lg"
                            fontWeight={500}
                            fontFamily={"poppins"}
                            _hover={{
                                bg: "primary.300"
                            }} >
                            Sign Up
                        </Button>
                    </Flex>
                </Stack>
            </form>
        </Box>
    );
}
