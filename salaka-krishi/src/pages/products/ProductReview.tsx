import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useQueries } from "@tanstack/react-query";
import type { ProductSchema } from "@src/schema/product";
import { getProductReview } from "@src/api/review";
import ReviewCard from "@src/components/cards/review/ReviewCard";

interface ProductReviewsProps {
    products: ProductSchema[];
}

export default function ProductReviews({ products }: ProductReviewsProps) {
    // Fetch reviews for top products
    const productReviewsQueries = useQueries({
        queries: products.map(product => ({
            queryKey: ["productReviews", product.id],
            queryFn: async () => {
                const res = await getProductReview(product.id, 1);
                return res.data;
            }
        }))
    });

    const anyReviewLoading = productReviewsQueries.some(q => q.isLoading);

    const specificReviews = productReviewsQueries
        .map(q => (q.data as any)?.data?.reviews?.[0])
        .filter(review => review && review.id);

    if (anyReviewLoading) {
        return (
            <Flex gridColumn="1 / -1" justify="center" py={8}>
                <Spinner color="primary.100" size="lg" />
            </Flex>
        );
    }

    if (specificReviews.length === 0) {
        return (
            <Text color="text.200" gridColumn="1 / -1">
                No specific product reviews yet. Be the first to add one!
            </Text>
        );
    }

    return (
        <>
            {specificReviews.map(review => (
                <ReviewCard
                    key={review.id}
                    person={{
                        id: review.id,
                        name: review.User?.firstName
                            ? review.User.firstName + " " + review.User.lastName
                            : review.User?.lastName || "Anonymous",
                        date: new Date(review.createdAt)
                            .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                            .replace(/ /g, "-"),
                        message: review.comment,
                        rating: review.rating,
                    }}
                />
            ))}
        </>
    );
}
