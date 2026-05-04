import { CardContent, CardMedia, Chip, Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { Stack } from "@mui/system";
import IconButton from "components/@extended/IconButton";
import MainCard from "components/MainCard";
import { GalleryResponse } from "schema/gallery"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteGalleryImage } from "api/gallery";
import { usePathname, useRouter } from "next/navigation";
import { useConfirm } from "components/ConfirmDialog";

interface GalleryInterface {
    gallery: GalleryResponse;
}

export default function Gallery({ gallery }: GalleryInterface) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const imageUrl = gallery.imageUrl && `${baseUrl}/uploads/${gallery.imageUrl}`;

    const queryClient = useQueryClient();
    const confirm = useConfirm();
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await deleteGalleryImage(id);
            return res.data;
        }
    });

    const handleDelete = async () => {
        const ok = await confirm({
            title: "Delete Gallery Image",
            message: `Are you sure you want to delete this image? This action cannot be undone.`,
            confirmText: "Delete",
            variant: "danger",
        });
        if (!ok) return;
        deleteMutation.mutate(gallery.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['gallery'] });
                toast.success('Image deleted successfully');
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || 'Failed to delete image';
                toast.error(message);
            }
        });
    }

    const router = useRouter();
    const currentUrl = usePathname();

    const handleEdit = () => {
        router.push(`${currentUrl}/${gallery.id}`);
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
            {gallery.imageUrl &&
                <Box sx={{ width: "100%", m: 'auto' }}>
                    <CardMedia
                        sx={{ height: 200, textDecoration: 'none' }}
                        image={imageUrl}
                    />
                </Box>
            }
            <Stack
                direction="row"
                sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'absolute', top: 0, pt: 1.75, pl: 2, pr: 1 }}>
                {gallery.isPublished ? 
                    <Chip variant="filled" color="success" size="small" label="Published" /> :
                    <Chip variant="filled" color="error" size="small" label="Draft" />
                }
                <Chip variant="combined" size="small" label={
                    <Stack direction="row" spacing={2} px={2} >
                        <IconButton aria-label="delete"
                            color="default"
                            onClick={handleDelete}
                            sx={{
                                width: "12px!important",
                                height: "12px!important",
                                ":hover": {
                                    backgroundColor: 'rgba(255, 165, 0, 0.1)'
                                }
                            }}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton aria-label="edit"
                            color="default"
                            onClick={handleEdit}
                            sx={{
                                width: "12px!important",
                                height: "12px!important",
                                ":hover": {
                                    backgroundColor: 'rgba(255, 165, 0, 0.1)'
                                }
                            }}>
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                    </Stack>} />
            </Stack>
            <Divider />
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                                {gallery.title || "Untitled Image"}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard >
    )
}
