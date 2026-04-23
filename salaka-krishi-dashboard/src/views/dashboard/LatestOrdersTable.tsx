'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import MainCard from 'components/MainCard';

interface Order {
    id: string;
    customer: string;
    status: string;
    total: number;
    createdAt: string;
}

interface Props {
    orders?: Order[];
}

function getStatusColor(status: string): 'warning' | 'success' | 'error' | 'default' {
    switch (status) {
        case 'Pending': return 'warning';
        case 'Delivered': return 'success';
        case 'Cancelled': return 'error';
        default: return 'default';
    }
}

export default function LatestOrdersTable({ orders = [] }: Props) {
    return (
        <MainCard title="Latest Orders" content={false} sx={{ height: '100%' }}>
            <TableContainer sx={{ maxHeight: 380 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Order</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body2" color="text.secondary" py={2}>No orders yet</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {orders.map((order) => (
                            <TableRow hover key={order.id} sx={{ '&:last-child td': { border: 0 } }}>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600} color="primary">
                                        #{order.id}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 100 }}>
                                        {order.customer}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={order.status}
                                        color={getStatusColor(order.status)}
                                        size="small"
                                        variant="combined"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" fontWeight={600}>
                                        Rs. {order.total.toLocaleString()}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}
