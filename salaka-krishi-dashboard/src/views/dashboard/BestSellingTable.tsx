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
import MainCard from 'components/MainCard';

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

interface Product {
    id: string;
    name: string;
    sold: number;
    price: number;
    imageUrls: string[];
}

interface Props {
    products?: Product[];
}

export default function BestSellingTable({ products = [] }: Props) {
    return (
        <MainCard title="Best Selling" content={false} sx={{ height: '100%' }}>
            <TableContainer sx={{ maxHeight: 380 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Sold</TableCell>
                            <TableCell align="right">Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <Typography variant="body2" color="text.secondary" py={2}>No products found</Typography>
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
                                    <Typography variant="body2" fontWeight={600}>{product.sold}</Typography>
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
