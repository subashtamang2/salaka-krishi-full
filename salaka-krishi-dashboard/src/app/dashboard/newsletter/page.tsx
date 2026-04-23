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
import { deleteNewsletter, getNewsletters, toggleNewsletterStatus } from 'api/newsletter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NewsletterSchema, NEWSLETTER_STATUS } from 'schema/newsletter';
import { DataWrapper, UserRole } from 'schema/schema';
import { Button, Stack, Chip, Typography, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { userStore } from 'store/userStore';
import { format } from 'date-fns';
import { useConfirm } from 'components/ConfirmDialog';

function ActionButton({ id, status }: { id: string; status: NEWSLETTER_STATUS }) {
    const queryClient = useQueryClient();
    const confirm = useConfirm();

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await deleteNewsletter(id);
            return rest.data;
        }
    });

    const statusMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await toggleNewsletterStatus(id);
            return rest.data;
        }
    });

    const handleDelete = async () => {
        const ok = await confirm({
            title: "Delete Subscriber",
            message: "Are you sure you want to delete this subscriber? This action cannot be undone.",
            confirmText: "Delete",
            variant: "danger",
        });
        if (!ok) return;
        deleteMutation.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['newsletters'] });
                toast.success('Subscriber deleted successfully');
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || 'Failed to delete subscriber';
                toast.error(message);
            }
        });
    }

    const handleToggleStatus = async () => {
        const action = status === NEWSLETTER_STATUS.Subscribed ? 'unsubscribe' : 'subscribe';
        const ok = await confirm({
            title: action === 'unsubscribe' ? 'Unsubscribe' : 'Subscribe',
            message: `Are you sure you want to ${action} this email?`,
            confirmText: action === 'unsubscribe' ? 'Unsubscribe' : 'Subscribe',
            variant: "warning",
        });
        if (!ok) return;
        statusMutation.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['newsletters'] });
                toast.success(`Subscriber ${action}d successfully`);
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || `Failed to ${action} subscriber`;
                toast.error(message);
            }
        });
    }

    return (
        <Stack direction="row" spacing={1} justifyContent="center">
            <Button
                onClick={handleToggleStatus}
                variant="text"
                color={status === NEWSLETTER_STATUS.Subscribed ? 'warning' : 'success'}
                size='small'>
                {status === NEWSLETTER_STATUS.Subscribed ? 'Unsubscribe' : 'Subscribe'}
            </Button>
            <Button
                onClick={handleDelete}
                variant="text"
                color='error'
                size='small'>Delete</Button>
        </Stack>
    );
}

export default function NewsletterPage() {
    const currentUser = userStore((state) => state.user);

    const { data: newsletterRes, isLoading, isError } = useQuery<DataWrapper<NewsletterSchema[]>>({
        queryKey: ['newsletters'],
        queryFn: async () => {
            const rest = await getNewsletters();
            return rest.data;
        }
    });

    if (isLoading) return <Loading />
    if (isError) return <Error404 title="Newsletters not found" />
    
    const newsletterList = newsletterRes?.data || [];

    return (
        <MainCard content={false} title="Newsletter Subscribers" secondary={null}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="newsletter table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">Joined Date</TableCell>
                            {currentUser?.role === UserRole.SuperAdmin && (
                                <TableCell align="center">Action</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {newsletterList.map((item) => (
                            <TableRow hover key={item.id}>
                                <TableCell component="th" scope="row">
                                    <Typography variant="subtitle1">
                                        {item.email}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Chip 
                                        label={item.status} 
                                        size="small" 
                                        color={item.status === NEWSLETTER_STATUS.Subscribed ? 'success' : 'error'} 
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell align="left">
                                    {item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy') : 'N/A'}
                                </TableCell>

                                {currentUser?.role === UserRole.SuperAdmin && (
                                    <TableCell align="center">
                                        <ActionButton id={item.id} status={item.status} />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {newsletterList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Box sx={{ py: 3 }}>
                                        <Typography variant="h6" color="textSecondary">
                                            No newsletter subscribers found
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
