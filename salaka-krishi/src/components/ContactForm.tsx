import {
    Button,
    Field,
    Flex,
    Grid,
    Input,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { addContact } from "@src/api/contact";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toaster } from "./ui/toaster";

export interface ContactFormProps {
    name: string;
    address: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactForm() {

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm<ContactFormProps>();
    const contactFormMutation = useMutation({
        mutationFn: async (data: ContactFormProps) => {
            const res = await addContact(data);
            res.data;
        }
    })

    const onSubmit = (data: ContactFormProps) => {
        contactFormMutation.mutate(data, {
            onSuccess: () => {
                toaster.create({
                    title: "Message Sent Successfully",
                    description: `${data.name} form has been submitted successfully.`,
                    type: "success",
                    duration: 1000,
                });
                reset();
            },
            onError: () => {
                toaster.create({
                    title: "Error",
                    description: "There was an error submitting the form. Please try again later.",
                    type: "error",
                    duration: 1000,
                });
            }

        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
                gap={{ base: 2, sm: 2, md: 2, lg: 4 }}
                mb={6}
                templateColumns={{
                    base: "1fr",
                    md: "1fr 1fr"
                }}>
                <Field.Root invalid={!!errors.name}>
                    <Field.Label htmlFor="name"  >
                        Full Name <Text as="span" color="muted.500">*</Text>
                    </Field.Label>
                    <Input

                        variant="subtle"
                        placeholder="Enter your full name"
                        {...register("name", {
                            required: "Full name is required",
                        })}
                    />

                    <Field.ErrorText>
                        {errors.name?.message}
                    </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.address}>
                    <Field.Label >
                        Address <Text as="span" color="muted.500">*</Text>
                    </Field.Label>

                    <Input
                        variant="subtle"

                        placeholder="Enter your address"
                        {...register("address", {
                            required: "Address is required",
                        })}
                    />

                    <Field.ErrorText>
                        {errors.address?.message}
                    </Field.ErrorText>
                </Field.Root>


                <Field.Root invalid={!!errors.phone}>
                    <Field.Label >
                        Phone <Text as="span" color="muted.500">*</Text>
                    </Field.Label>

                    <Input
                        variant="subtle"
                        type="tel"
                        autoComplete="tel"

                        placeholder="Enter your phone"
                        {...register("phone", {
                            required: "Phone number is required",
                            pattern: {
                                value: /^9[0-9]{9}$/,
                                message: "Invalid phone number",
                            },
                        })}
                    />

                    <Field.ErrorText>
                        {errors.phone?.message}
                    </Field.ErrorText>
                </Field.Root>


                <Field.Root invalid={!!errors.email}>
                    <Field.Label >
                        Email <Text as="span" color="muted.500">*</Text>
                    </Field.Label>

                    <Input
                        variant="subtle"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value:
                                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address",
                            },
                        })}
                    />

                    <Field.ErrorText>
                        {errors.email?.message}
                    </Field.ErrorText>
                </Field.Root>
            </Grid>


            <Field.Root invalid={!!errors.subject}>
                <Field.Label>
                    Subject <Text as="span" color="muted.500">*</Text>
                </Field.Label>

                <Input
                    variant="subtle"
                    placeholder="Enter your subject"
                    mb={6}
                    {...register("subject", {
                        required: "Subject is required",
                    })}
                />

                <Field.ErrorText>
                    {errors.subject?.message}
                </Field.ErrorText>
            </Field.Root>


            <Field.Root invalid={!!errors.message}>
                <Field.Label >
                    Send Message <Text as="span" color="muted.500">*</Text>
                </Field.Label>

                <Textarea
                    variant={"subtle"}

                    rows={6}
                    placeholder="your messages...."
                    {...register("message", {
                        required: "Message is required",
                    })}
                />

                <Field.ErrorText>
                    {errors.message?.message}
                </Field.ErrorText>
            </Field.Root>

            <Flex justifyContent="end" mt={6}>
                <Button
                    type="submit"
                    py={5}
                    px={4}
                    _hover={{
                        bg: "primary.300"
                    }}
                    rounded="sm">

                    Send Message
                </Button>
            </Flex>
        </form>
    );
}
