"use client";

import MainCard from 'components/MainCard';
import {
    Box,
    CardContent,
    CardMedia,
    Chip,
    Divider,
    IconButton,
    Stack,
    Typography
} from '@mui/material';
import { Grid } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import { OfferBannerInterface } from 'schema/offer-banner';
import { deleteOfferBanner } from 'api/offer-banner';

interface OfferBannerCardProps {
    banner: OfferBannerInterface;
}

export default function OfferBannerCard({ banner }: OfferBannerCardProps) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const bannerImage = `${baseUrl}/uploads/${banner?.imageUrl}`;
    
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await deleteOfferBanner(id);
            return rest.data;
        }
    });

    const queryClient = useQueryClient();
    const handleDelete = () => {
        deleteMutation.mutate(banner.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['offer-banners'] });
                toast.success('Offer Banner deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete offer banner');
            }
        });
    }
    
    const router = useRouter();
    const currentUrl = usePathname();

    const handleEdit = () => {
        router.push(`${currentUrl}/${banner.id}`);
    }

    return (
        <MainCard
            content={false}
            sx={{
                '&:hover': {
                    transform: 'scale3d(1.02, 1.02, 1)',
                    transition: 'all .4s ease-in-out'
                }
            }}>
            <Box sx={{ width: "100%", m: 'auto' }}>
                <CardMedia
                    sx={{ height: 200, textDecoration: 'none' }}
                    image={bannerImage}
                />
            </Box>
            <Stack
                direction="row"
                sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'absolute', top: 0, pt: 1.75, pl: 2, pr: 1 }}>
                {banner.isActive && <Chip variant="filled" color="success" size="small" label={"Active"} />}
                {banner.tag && <Chip variant="filled" color="primary" size="small" label={banner.tag} />}
                <Chip variant="filled" color="warning" size="small" label={
                    <Stack direction="row" spacing={2} px={2}>
                        <IconButton aria-label="delete"
                            onClick={handleDelete}
                            sx={{
                                width: "12px!important",
                                height: "12px!important",
                            }}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton aria-label="edit"
                            onClick={handleEdit}
                            sx={{
                                width: "12px!important",
                                height: "12px!important",
                            }}>
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                    </Stack>} />
            </Stack>
            <Divider />
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Stack>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'block',
                                    textDecoration: 'none'
                                }}>
                                {banner.title}
                            </Typography>
                            {banner.subtitle && (
                                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                    {banner.subtitle}
                                </Typography>
                            )}
                            <Typography variant="body2" sx={{ 
                                color: 'text.secondary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}>
                                {banner.description}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard >
    );
}
