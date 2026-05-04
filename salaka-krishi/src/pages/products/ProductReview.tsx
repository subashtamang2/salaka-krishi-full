import { Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getGlobalProductReviews } from "@src/api/review";
import ReviewCard from "@src/components/cards/review/ReviewCard";
import ReviewLoading from "../Loadings/ReviewLoading";

export default function ProductReviews() {
    const { data: reviewsResponse, isLoading } = useQuery({
        queryKey: ["globalProductReviews"],
        queryFn: async () => {
            const res = await getGlobalProductReviews(1, 4);
            return res.data;
        }
    });

    const reviews = (reviewsResponse as any)?.data?.reviews || [];

    if (isLoading) {
        return (
            <ReviewLoading count={4} />
        );
    }

    if (reviews.length === 0) {
        return (
            <Text color="text.200" gridColumn="1 / -1">
                No product reviews yet. Be the first to add one!
            </Text>
        );
    }

    return (
        <>
            {reviews.map((review: any) => (
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
