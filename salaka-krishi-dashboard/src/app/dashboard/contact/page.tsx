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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContactInterface, ContactStatus, DataWrapper } from 'schema/schema';
import { Autocomplete, Button, Stack } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { deleteContact, getContacts, updateContactStatus } from 'api/contact';
import { TextField } from '@mui/material';


function ActionButton({ id }: { id: string }) {

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await deleteContact(id);
            return rest.data;
        }
    });
    const queryClient = useQueryClient();
    const handleDeleteUser = () => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['contact-forms'] });
                toast.success('Deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete ');
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

function ChangeStatusButton({ id, value }: { id: string, value: ContactStatus }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (newStatus: string) =>
            updateContactStatus(id, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contact-forms'] });
            toast.success('Status updated');
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });
    return (
        <>
            <Autocomplete
                id="status"
                value={value}
                onChange={(_, newValue) => {
                    if (newValue && newValue !== value) {
                        mutation.mutate(newValue);
                    }
                }}
                options={Object.entries(ContactStatus).map(([_, value]) => value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Select Status"
                        sx={{ "& .MuiAutocomplete-input.Mui-disabled": { WebkitTextFillColor: "text.primary" } }}
                    />
                )}
            />

        </>
    );
}
export default function page() {
    const { data: userRes, isLoading, isError } = useQuery<DataWrapper<ContactInterface[]>>({
        queryKey: ['contact-forms'],
        queryFn: async () => {
            const rest = await getContacts();
            return rest.data;
        }
    });
    if (isLoading) return <Loading />
    if (isError) return <Error404 title="Contacts not found" />
    const userList = userRes?.data || [];

    return (
        <MainCard content={false} title="Contacts" secondary={null}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Address</TableCell>
                            <TableCell align="left">Phone</TableCell>
                            <TableCell align="left">Subject</TableCell>
                            <TableCell align="left">Message</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map((user) => (
                            <TableRow hover key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    {user.name}
                                </TableCell>
                                <TableCell align="left">{user.email}</TableCell>
                                <TableCell align="left">{user.address}</TableCell>
                                <TableCell align="left">{user.phone}</TableCell>
                                <TableCell align="left">{user.subject}</TableCell>
                                <TableCell align="left">{user.message}</TableCell>
                                <TableCell align="left"><ChangeStatusButton id={user.id} value={user.status} /></TableCell>
                                <TableCell align="left"><ActionButton id={user.id} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}
