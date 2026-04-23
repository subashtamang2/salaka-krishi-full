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
import { deleteCustomer, getCustomers, updateCustomerStatus } from 'api/customer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CustomerSchema, USER_STATUS } from 'schema/customer';
import { DataWrapper, UserRole } from 'schema/schema';
import { Button, Stack, Chip } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { userStore } from 'store/userStore';
import { format } from 'date-fns';
import { useConfirm } from 'components/ConfirmDialog';

function ActionButton({ id, status }: { id: string; status: USER_STATUS }) {
    const queryClient = useQueryClient();
    const confirm = useConfirm();

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await deleteCustomer(id);
            return rest.data;
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: USER_STATUS }) => {
            const rest = await updateCustomerStatus(id, status);
            return rest.data;
        }
    });

    const handleDeleteCustomer = async () => {
        const ok = await confirm({
            title: "Delete Customer",
            message: "Are you sure you want to delete this customer? This action cannot be undone.",
            confirmText: "Delete",
            variant: "danger",
        });
        if (!ok) return;
        deleteMutation.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['customers'] });
                toast.success('Customer deleted successfully');
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || 'Failed to delete customer';
                toast.error(message, { autoClose: 10000 });
            }
        });
    }

    const handleDeactivate = async () => {
        const newStatus = status === USER_STATUS.Active ? USER_STATUS.Inactive : USER_STATUS.Active;
        const action = status === USER_STATUS.Active ? 'deactivate' : 'activate';
        
        const ok = await confirm({
            title: action === 'deactivate' ? 'Deactivate Customer' : 'Activate Customer',
            message: `Are you sure you want to ${action} this customer?`,
            confirmText: action === 'deactivate' ? 'Deactivate' : 'Activate',
            variant: action === 'deactivate' ? 'warning' : 'info',
        });
        if (!ok) return;
        statusMutation.mutate({ id, status: newStatus }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['customers'] });
                toast.success(`Customer ${action}d successfully`);
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || `Failed to ${action} customer`;
                toast.error(message);
            }
        });
    }

    return (
        <Stack direction="row" spacing={1} justifyContent="center">
            <Button
                onClick={handleDeactivate}
                variant="text"
                color={status === USER_STATUS.Active ? 'warning' : 'success'}
                size='small'>
                {status === USER_STATUS.Active ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
                onClick={handleDeleteCustomer}
                variant="text"
                color='error'
                size='small'>Delete</Button>
        </Stack>
    );
}

export default function CustomerPage() {
    const currentUser = userStore((state) => state.user);

    const { data: customerRes, isLoading, isError } = useQuery<DataWrapper<CustomerSchema[]>>({
        queryKey: ['customers'],
        queryFn: async () => {
            const rest = await getCustomers();
            return rest.data;
        }
    });

    if (isLoading) return <Loading />
    if (isError) return <Error404 title="Customers not found" />
    
    const customerList = customerRes?.data || [];

    return (
        <MainCard content={false} title="Customers" secondary={null}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

            <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="customer table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Role</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">Cart Items</TableCell>
                            <TableCell align="left">Joined Date</TableCell>
                            {currentUser?.role === UserRole.SuperAdmin && (
                                <TableCell align="center">Action</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customerList.map((customer) => {
                            const isMe = customer.id === currentUser?.id;
                            return (
                                <TableRow
                                    hover
                                    key={customer.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        backgroundColor: isMe ? 'rgba(0, 200, 83, 0.08)' : 'inherit',
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <span>{customer.firstName} {customer.lastName}</span>
                                            {isMe && <span style={{ color: '#00c853', fontSize: '10px', fontWeight: 600 }}>(You)</span>}
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">{customer.email}</TableCell>
                                    <TableCell align="left">
                                        <Chip label={customer.role} size="small" variant="outlined" color={customer.role === 'SuperAdmin' ? 'primary' : 'default'} />
                                    </TableCell>
                                    <TableCell align="left">
                                        <Chip 
                                            label={customer.status} 
                                            size="small" 
                                            color={customer.status === 'Active' ? 'success' : 'error'} 
                                        />
                                    </TableCell>
                                    <TableCell align="center">{customer.noOfProductIncart || 0}</TableCell>
                                    <TableCell align="left">{format(new Date(customer.createdAt), 'dd MMM yyyy')}</TableCell>

                                    {currentUser?.role === UserRole.SuperAdmin && (
                                        <TableCell align="center">
                                            {!isMe && <ActionButton id={customer.id} status={customer.status} />}
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                        {customerList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No customers found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}
