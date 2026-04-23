'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MainCard from 'components/MainCard';

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

interface Product {
    id: string;
    name: string;
    stock: number;
    price: number;
    imageUrls: string[];
}

interface Props {
    products?: Product[];
}

function getStockColor(stock: number): 'error' | 'warning' | 'info' {
    if (stock <= 5) return 'error';
    if (stock <= 10) return 'warning';
    return 'info';
}

export default function LowStockTable({ products = [] }: Props) {
    return (
        <MainCard title="Low Stock Alert" content={false} sx={{ height: '100%' }}>
            <TableContainer sx={{ maxHeight: 380 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Stock</TableCell>
                            <TableCell align="right">Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <Typography variant="body2" color="text.secondary" py={2}>All stocked up! 🎉</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {products.map((product) => (
                            <TableRow hover key={product.id} sx={{ '&:last-child td': { border: 0 } }}>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                        <Box
                                            component="img"
                                            src={product.imageUrls?.[0] ? `${imageBaseUrl}/${product.imageUrls[0]}` : '/assets/images/maintenance/img-error-404.svg'}
                                            alt={product.name}
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 1,
                                                objectFit: 'cover',
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        />
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                                            {product.name}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell align="right">
                                    <Chip
                                        label={product.stock}
                                        color={getStockColor(product.stock)}
                                        size="small"
                                        variant="combined"
                                        sx={{ fontWeight: 600, minWidth: 32 }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2">Rs. {product.price.toLocaleString()}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}
