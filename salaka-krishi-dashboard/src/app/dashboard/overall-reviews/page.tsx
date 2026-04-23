"use client";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MainCard from 'components/MainCard';
import Loading from '../loading';
import Error404 from '../error';
import { deleteOverallReview, getOverallReviews } from 'api/overall-reviews';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OverallReviewSchema } from 'schema/overall-reviews';
import { DataWrapper, UserRole } from 'schema/schema';
import { Button, Stack, Rating, Typography, Box, Avatar } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { userStore } from 'store/userStore';
import { format } from 'date-fns';
import { useConfirm } from 'components/ConfirmDialog';

function ActionButton({ id }: { id: string }) {
    const queryClient = useQueryClient();
    const confirm = useConfirm();

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await deleteOverallReview(id);
            return rest.data;
        }
    });

    const handleDeleteReview = async () => {
        const ok = await confirm({
            title: "Delete Overall Review",
            message: "Are you sure you want to delete this review? This action cannot be undone.",
            confirmText: "Delete",
            variant: "danger",
        });
        if (!ok) return;
        deleteMutation.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['overall-reviews'] });
                toast.success('Review deleted successfully');
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || 'Failed to delete review';
                toast.error(message);
            }
        });
    }

    return (
        <Button
            onClick={handleDeleteReview}
            variant="text"
            color='error'
            size='small'>Delete</Button>
    );
}

export default function OverallReviewsPage() {
    const currentUser = userStore((state) => state.user);

    const { data: reviewRes, isLoading, isError } = useQuery<DataWrapper<OverallReviewSchema[]>>({
        queryKey: ['overall-reviews'],
        queryFn: async () => {
            const rest = await getOverallReviews();
            return rest.data;
        }
    });

    if (isLoading) return <Loading />
    if (isError) return <Error404 title="Overall Reviews not found" />
    
    const reviewList = reviewRes?.data || [];

    return (
        <MainCard content={false} title="Overall Reviews (Vegetables Page)" secondary={null}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="overall reviews table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Customer</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Rating</TableCell>
                            <TableCell align="left">Comment</TableCell>
                            <TableCell align="left">Date</TableCell>
                            {(currentUser?.role === UserRole.Admin || currentUser?.role === UserRole.SuperAdmin) && (
                                <TableCell align="center">Action</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviewList.map((review) => (
                            <TableRow hover key={review.id}>
                                <TableCell component="th" scope="row">
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar src={review.imageUrl} alt={review.name}>
                                            {review.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="subtitle1">
                                            {review.name}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="body2">
                                        {review.email}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <Rating value={review.rating} precision={0.5} size="small" readOnly />
                                        <Typography variant="caption">({review.rating})</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="body2" sx={{ 
                                        maxWidth: 300, 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis', 
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {review.review}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    {review.createdAt ? format(new Date(review.createdAt), 'dd MMM yyyy') : 'N/A'}
                                </TableCell>

                                {(currentUser?.role === UserRole.Admin || currentUser?.role === UserRole.SuperAdmin) && (
                                    <TableCell align="center">
                                        <ActionButton id={review.id} />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {reviewList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Box sx={{ py: 3 }}>
                                        <Typography variant="h6" color="textSecondary">
                                            No overall reviews found
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}
