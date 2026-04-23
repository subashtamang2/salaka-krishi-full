import {
    Button,
    Flex,
    Field,
    Grid,
    Input,
    Textarea,
    Box,
    Text,
    Portal,
    CloseButton,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { Rating } from "react-simple-star-rating";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addOverallReview } from "@src/api/overallReviews";

interface ReviewFormProps {
    fullName: string;
    email: string;
    rating: number;
    review: string;
}

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReviewFormModal({ isOpen, onClose }: ReviewFormModalProps) {

    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        handleSubmit,
        register,
        control,
        reset,
        formState: { errors },
    } = useForm<ReviewFormProps>();

    const onSubmit = async (data: ReviewFormProps) => {
        try {
            setIsSubmitting(true);
            await addOverallReview({
                name: data.fullName,
                email: data.email,
                review: data.review,
                rating: data.rating,
            });
            queryClient.invalidateQueries({ queryKey: ["overall-reviews"] });
            reset();
            onClose();
        } catch (err) {
            console.error("Failed to submit review:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <Box
                position="fixed"
                inset={0}
                bg="blackAlpha.600"
                zIndex={1400}
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={{ base: 4, md: 0 }}>
                <Box
                    bg="white"
                    maxW="2xl"
                    w="full"
                    borderRadius="md"
                    overflow="hidden"
                    position={"relative"}>

                    <Box
                        bg="primary.100/10"
                        color="black.400"
                        p={6}
                        textAlign="center"
                        fontSize="4xl"
                        fontFamily={"primary"}
                        fontWeight={400}>
                        Write a Review
                    </Box>
                    <Flex
                        flexDir={"column"}
                        position={"absolute"}
                        top={{ base: 2, md: 4 }}
                        right={{ base: 2, md: 4 }}>

                        <CloseButton
                            size={{ base: "md", md: "lg" }}
                            _hover={{
                                bg: "transparent"
                            }}
                            onClick={onClose}
                            cursor="pointer"
                        />
                    </Flex>
                    <Box p={6}>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <Flex
                                flexDir={"column"}
                                gap={10}>
                                <Grid
                                    gap={4}
                                    mb={6}
                                    templateColumns={{
                                        base: "1fr",
                                        md: "1fr 1fr"
                                    }}>
                                    <Field.Root invalid={!!errors.fullName}>
                                        <Field.Label htmlFor="fullName" color={"text.900"}>
                                            Full Name <Text as="span" color="muted.500">*</Text>
                                        </Field.Label>
                                        <Input
                                            variant={"outline"}
                                            id="fullName"
                                            placeholder="Enter your full name"
                                            {...register("fullName", { required: "Full name is required" })} />
                                        <Field.ErrorText>{errors.fullName?.message}</Field.ErrorText>
                                    </Field.Root>

                                    <Field.Root invalid={!!errors.email}>
                                        <Field.Label htmlFor="email" color={"text.900"}>
                                            Email Address <Text as="span" color="muted.500">*</Text>
                                        </Field.Label>
                                        <Input
                                            variant={"outline"}
                                            id="email"
                                            placeholder="Enter your email"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                    message: "Invalid email address",
                                                },
                                            })} />
                                        <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                                    </Field.Root>
                                </Grid>


                            </Flex>
                            <Field.Root invalid={!!errors.rating} mb={6}>
                                <Field.Label color={"text.900"} >
                                    Rating <Text as="span" color="muted.500">*</Text>
                                </Field.Label>
                                <Controller
                                    name="rating"
                                    control={control}
                                    rules={{ required: "Rating is required" }}
                                    render={({ field }) => (
                                        <Box display="inline-flex" alignItems="center">
                                            <Rating
                                                {...field}
                                                initialValue={field.value || 0}
                                                onClick={field.onChange}
                                                readonly={false}
                                                allowFraction
                                                size={25}
                                                fillColor="#FFD700"
                                                emptyColor="#E1E4EB"
                                                SVGstyle={{ display: "inline-block" }}
                                            />
                                        </Box>
                                    )}
                                />
                                <Field.ErrorText>{errors.rating?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.review}>
                                <Field.Label htmlFor="review" color={"text.900"}>
                                    Review <Text as="span" color="muted.500">*</Text>
                                </Field.Label>
                                <Textarea
                                    variant={"outline"}
                                    id="review"
                                    rows={6}
                                    placeholder="Write your review..."
                                    {...register("review", { required: "Review is required" })}
                                />
                                <Field.ErrorText>{errors.review?.message}</Field.ErrorText>
                            </Field.Root>

                            <Flex justifyContent="center" mt={6} mb={4}>
                                <Button
                                    type="submit"
                                    py={6}
                                    px={12}
                                    fontFamily={"poppins"}
                                    fontSize={"sm"}
                                    fontWeight={400}
                                    color="white"
                                    bg="primary.100"
                                    _hover={{ bg: "primary.500" }}
                                    _active={{ bg: "primary.600" }}
                                    loading={isSubmitting}
                                    disabled={isSubmitting}>
                                    Submit
                                </Button>
                            </Flex>
                        </form>
                    </Box>
                </Box>
            </Box>
        </Portal>
    );
}
