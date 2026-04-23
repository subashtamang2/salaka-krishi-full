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
import { deleteUser, getUsers } from 'api/staff';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CurrentUser, DataWrapper, UserRole } from 'schema/schema';
import { Button, Stack } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { userStore } from 'store/userStore';


function ActionButton({ id }: { id: string }) {

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await deleteUser(id);
            return rest.data;
        }
    });
    const queryClient = useQueryClient();
    const handleDeleteUser = () => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['team-members'] });
                toast.success('User deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete user');
            }
        });
    }

    return (
        <>
            <Stack gap={1}>
                <Button
                    onClick={handleDeleteUser}
                    variant="text"
                    color='error'
                    size='small'>Delete</Button>
            </Stack>
        </>
    );
}

export default function page() {

    const currentUser = userStore((state) => state.user);

    const { data: userRes, isLoading, isError } = useQuery<DataWrapper<CurrentUser[]>>({
        queryKey: ['team-members'],
        queryFn: async () => {
            const rest = await getUsers();
            return rest.data;
        }
    });
    if (isLoading) return <Loading />
    if (isError) return <Error404 title="User not found" />
    const userList = userRes?.data || [];

    return (
        <MainCard content={false} title="Team Members" secondary={null}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Role</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">BLogs Posted</TableCell>
                            <TableCell align="left">Products Add</TableCell>

                            {
                                currentUser?.role === UserRole.SuperAdmin && (
                                    <TableCell align="left">Action</TableCell>)
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map((user) => {
                            const isMe = user.id === currentUser?.id;
                            return (
                                <TableRow
                                    hover
                                    key={user.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        backgroundColor: isMe ? 'rgba(0, 200, 83, 0.08)' : 'inherit',
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <span>{user.firstName} {user.lastName}</span>
                                            {isMe && <span style={{ color: '#00c853', fontSize: '10px', fontWeight: 600 }}>(You)</span>}
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">{user.email}</TableCell>
                                    <TableCell align="left">{user.role}</TableCell>
                                    <TableCell align="left" sx={{ color: 'red' }}>{user.status}</TableCell>
                                    <TableCell align="left">{user._count?.blogs}</TableCell>
                                    <TableCell align="left">{user._count?.products}</TableCell>

                                    {
                                        currentUser?.role === UserRole.SuperAdmin && (
                                            <TableCell align="left">
                                                {!isMe && <ActionButton id={user.id} />}
                                            </TableCell>
                                        )
                                    }
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}
