"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Typography,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,

    IconButton,
    Avatar,
    Tooltip,
} from "@mui/material";
import {
    Edit,
    Trash,
} from "@wandersonalwes/iconsax-react";
import { DataWrapper } from "schema/schema";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "components/Loader";
import Error404 from "../error";
import { getClientReviews, deleteClientReview } from "api/client-reviews";
import { ClientReviewSchema } from "schema/client-review";
import { useConfirm } from "components/ConfirmDialog";

export default function TestimonialsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const confirm = useConfirm();

    const { data: clientReviewList, isLoading, isError } = useQuery<DataWrapper<ClientReviewSchema[]>>({
        queryKey: ["clients-review"],
        queryFn: async () => {
            const rest = await getClientReviews();
            return rest.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteClientReview(id);
        },
        onSuccess: () => {
            toast.success("Testimonial deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["clients-review"] });
        },
        onError: () => {
            toast.error("Failed to delete testimonial");
        }
    });

    const handleDelete = async (id: string) => {
        const ok = await confirm({
            title: "Delete Testimonial",
            message: "Are you sure you want to delete this client review? This action cannot be undone.",
            confirmText: "Delete",
            variant: "danger",
        });
        if (ok) {
            deleteMutation.mutate(id);
        }
    };

    const clientReviews = clientReviewList?.data || [];

    if (isLoading) return <Loader />;
    if (isError) return <Error404 title="Client Review not found" />;

    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

    return (
        <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

            {/* Header Section */}

            {/* Table Section */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, py: 2 }}>Client</TableCell>
                            <TableCell sx={{ fontWeight: 600, py: 2 }}>Position</TableCell>
                            <TableCell sx={{ fontWeight: 600, py: 2 }}>Review</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientReviews.length > 0 ? (
                            clientReviews.map((review) => {
                                let imgSrc = undefined;
                                if (review.imageUrl) {
                                    if (review.imageUrl.startsWith("http")) {
                                        imgSrc = review.imageUrl;
                                    } else {
                                        // Ensure we don't double-append /uploads if baseUrl already has it
                                        const cleanBaseUrl = baseUrl?.endsWith("/uploads") ? baseUrl : `${baseUrl}/uploads`;
                                        imgSrc = `${cleanBaseUrl}/${review.imageUrl}`;
                                    }
                                }

                                return (
                                <TableRow key={review.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar
                                                src={imgSrc}
                                                alt={review.name}
                                                sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider' }}
                                            >
                                                {review.name.charAt(0)}
                                            </Avatar>
                                            <Typography variant="subtitle1" fontWeight={600}>{review.name}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="textSecondary">{review.position || "—"}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 400 }}>
                                        <Tooltip title={review.review} placement="top-start">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    color: 'text.primary'
                                                }}
                                            >
                                                {review.review}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => router.push(`/dashboard/testimonials/${review.id}`)}
                                                >
                                                    <Edit size="18" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDelete(review.id)}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash size="18" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )})
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                    <Stack alignItems="center" spacing={1}>
                                        <Typography variant="h5" color="textSecondary">No reviews found</Typography>
                                        <Typography variant="body2" color="textSecondary">Try adjusting your search or add a new testimonial</Typography>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}
