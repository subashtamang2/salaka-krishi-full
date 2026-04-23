"use client";

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { DataWrapper } from 'schema/schema';
import Loading from '../loading';
import {
    Button, Stack, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import Error404 from '../error';
import { OfferBannerInterface } from 'schema/offer-banner';
import { getOfferBanners, deleteOfferBanner } from 'api/offer-banner';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Page() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const currentUrl = usePathname();

    const { data: bannerList, isLoading, isError } = useQuery<DataWrapper<OfferBannerInterface[]>>({
        queryKey: ['offer-banners'],
        queryFn: async () => {
            const rest = await getOfferBanners();
            return rest.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await deleteOfferBanner(id);
            return rest.data;
        }
    });

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['offer-banners'] });
                toast.success('Offer Banner deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete offer banner');
            }
        });
    }

    const handleEdit = (id: string) => {
        router.push(`${currentUrl}/${id}`);
    }

    if (isLoading) return <Loading />;
    if (isError) return <Error404 title="Offer Banners not found" />;

    const banners = bannerList?.data || [];
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

    return (
        <>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Offer Banners</Typography>
                <Link href="/dashboard/offer-banner/add" passHref legacyBehavior>
                    <Button variant="contained">Add Offer Banner</Button>
                </Link>
            </Stack>

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="offer banners table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Subtitle</TableCell>
                            <TableCell>Tag</TableCell>
                            <TableCell>Dates</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {banners.map((banner) => (
                            <TableRow key={banner.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Box
                                        component="img"
                                        src={`${baseUrl}/uploads/${banner?.imageUrl}`}
                                        alt={banner.title}
                                        sx={{ height: 60, width: 100, objectFit: 'cover', borderRadius: 1 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {banner.title}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {banner.subtitle
                                            ? (banner.subtitle.split(' ').length > 4
                                                ? banner.subtitle.split(' ').slice(0, 4).join(' ') + '...'
                                                : banner.subtitle.length > 24
                                                    ? banner.subtitle.substring(0, 24) + '...'
                                                    : banner.subtitle)
                                            : '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {banner.tag ? <Chip variant="outlined" color="primary" size="small" label={banner.tag} /> : '-'}
                                </TableCell>
                                <TableCell>
                                    {banner.startDate || banner.endDate ? (
                                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                            {banner.startDate ? new Date(banner.startDate).toLocaleDateString() : 'N/A'}
                                            {" - "}
                                            {banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                    ) : (
                                        '-'
                                    )}
                                </TableCell>
                                <TableCell>
                                    {banner.endDate && new Date(banner.endDate) < new Date() ? (
                                        <Chip
                                            variant="filled"
                                            color="error"
                                            size="small"
                                            label="Expired"
                                        />
                                    ) : (
                                        <Chip
                                            variant="filled"
                                            color={banner.isActive ? "success" : "default"}
                                            size="small"
                                            label={banner.isActive ? "Active" : "Inactive"}
                                        />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <IconButton aria-label="edit" onClick={() => handleEdit(banner.id)} color="primary" size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={() => handleDelete(banner.id)} color="error" size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                        {banners.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">No offer banners found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
