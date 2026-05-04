import {
    Button,
    Flex,
    Field,
    Textarea,
    Box,
    Text,
    Portal,
    CloseButton,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { Rating } from "react-simple-star-rating";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addProductReview } from "@src/api/review";
import { toaster } from "@src/components/ui/toaster";
import useAuth from "@src/hooks/useAuth";
import { getAccessToken } from "@src/utils/local-storage";
import AuthContainer from "@src/components/common/auth/AuthContainer";
import { useNavigate } from "react-router";
import routes from "@src/router/routes";

interface ReviewFormProps {
    rating: number;
    comment: string;
}


interface ProductReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
}

type ModalView = "review" | "login" | "register";

export default function ProductReviewFormModal({ isOpen, onClose, productId, productName }: ProductReviewFormModalProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { refetch, userData } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [view, setView] = useState<ModalView>("review");

    // Robust auth check when opening the modal
    useEffect(() => {
        if (isOpen) {
            const token = getAccessToken();
            // Check specifically for null or undefined strings just in case
            if (!token || token === "null" || token === "undefined" || !userData?.data) {
                setView("login");
            } else {
                setView("review");
            }
        }
    }, [isOpen, userData]);

    const {
        handleSubmit,
        control,
        register,
        reset,
        formState: { errors },
    } = useForm<ReviewFormProps>({
        defaultValues: {
            rating: 0,
            comment: "",
        }
    });

    const onSubmit = async (data: ReviewFormProps) => {
        try {
            setIsSubmitting(true);
            const response = await addProductReview(productId, {
                rating: data.rating,
                comment: data.comment,
            });
            console.log("sucessResponse:", response.data);

            queryClient.invalidateQueries({ queryKey: ["product"] });
            queryClient.invalidateQueries({ queryKey: ["productReviews"] });
            queryClient.invalidateQueries({ queryKey: ["globalProductReviews"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["reviewCheck", productId] });

            toaster.create({
                title: "Review Submitted",
                description: `Your review for ${productName} has been submitted successfully.`,
                type: "success",
            });

            reset();
            onClose();
            // Redirect to Dairy page where reviews are displayed
            navigate(`${routes.products.root}/${routes.products.dairy}`);
        } catch (err: any) {
            console.error("Failed to submit review:", err);
            if (err?.response?.status === 403 || err?.response?.status === 401) {
                setView("login");
            } else {
                toaster.create({
                    title: "Error",
                    description: "Failed to submit your review. Please try again.",
                    type: "error",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    if (!isOpen) return null;

    const handleAuthSuccess = () => {
        setView("review");
        refetch();
    };

    const getHeaderTitle = () => {
        switch (view) {
            case "login": return "Login to continue";
            case "register": return "Create Account";
            default: return `Add Review for ${productName}`;
        }
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
                            _hover={{
                                bg: "transparent"
                            }}
                            onClick={() => {
                                setView("review");
                                onClose();
                            }}
                            cursor="pointer"
                        />
                    </Flex>
                    <Box p={view === "review" ? 6 : 0}>
                        {(view === "login" || view === "register") ? (
                            <AuthContainer 
                                onSuccess={handleAuthSuccess} 
                                initialView={view} 
                            />
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Field.Root invalid={!!errors.rating} mb={6}>
                                    <Field.Label color={"text.900"} >
                                        Rating <Text as="span" color="muted.500">*</Text>
                                    </Field.Label>
                                    <Controller
                                        name="rating"
                                        control={control}
                                        rules={{
                                            required: "Rating is required",
                                            min: { value: 0.5, message: "Please provide a rating" }
                                        }}
                                        render={({ field }) => (
                                            <Box display="inline-flex" alignItems="center">
                                                <Rating
                                                    {...field}
                                                    initialValue={field.value || 0}
                                                    onClick={field.onChange}
                                                    readonly={false}
                                                    allowFraction
                                                    size={30}
                                                    fillColor="#FFD700"
                                                    emptyColor="#E1E4EB"
                                                    SVGstyle={{ display: "inline-block" }}
                                                />
                                            </Box>
                                        )}
                                    />
                                    <Field.ErrorText>{errors.rating?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!errors.comment}>
                                    <Field.Label htmlFor="comment" color={"text.900"}>
                                        Comment <Text as="span" color="muted.500">*</Text>
                                    </Field.Label>
                                    <Textarea
                                        variant={"outline"}
                                        id="comment"
                                        rows={5}
                                        placeholder="Write your review..."
                                        {...register("comment", { required: "Comment is required" })}
                                    />
                                    <Field.ErrorText>{errors.comment?.message}</Field.ErrorText>
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
                                        _hover={{ bg: "primary.300" }}
                                        _active={{ bg: "primary.400" }}
                                        loading={isSubmitting}
                                        disabled={isSubmitting}>
                                        Submit Review
                                    </Button>
                                </Flex>
                            </form>
                        )}
                    </Box>
                </Box>
            </Box>
        </Portal>
    );
}
