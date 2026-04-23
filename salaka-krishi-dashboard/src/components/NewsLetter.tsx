"use client";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MainCard from 'components/MainCard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CurrentUser, DataWrapper, } from 'schema/schema';
import { Button, Stack } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import Loading from 'app/loading';
import Error404 from 'app/dashboard/error';
import { deleteSubscriber, getSubscribers } from 'api/newsletter';


function ActionButton({ id }: { id: string }) {

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await deleteSubscriber(id);
            return rest.data;
        }
    });
    const queryClient = useQueryClient();
    const handleDeleteUser = () => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['subscribers'] });
                toast.success('User deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete user');
            }
        });
    }

    return (
        <>
            <Stack
                gap={1}>
                <Button
                    onClick={handleDeleteUser}
                    variant="text"
                    color='error'
                    size='small'>Delete</Button>
            </Stack>
        </>
    );
}

export default function Newsletter() {

    const { data: subscriberRes, isLoading, isError } = useQuery<DataWrapper<CurrentUser[]>>({
        queryKey: ['subscribers'],
        queryFn: async () => {
            const rest = await getSubscribers();
            return rest.data;
        }
    });
    if (isLoading) return <Loading />
    if (isError) return <Error404 title="Subscribers not found" />
    const userList = subscriberRes?.data || [];

    return (
        <MainCard content={false} title="Our Subscribers" secondary={null}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="subscribers list table">
                    <TableHead>
                        <TableRow>
                            <TableCell>SN</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            userList.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No subscribers found.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        {userList.map((user, index) => (
                            <TableRow hover key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="left">{index + 1}</TableCell>
                                <TableCell align="left">{user.email}</TableCell>
                                <TableCell align="left"><ActionButton id={user.id} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}
