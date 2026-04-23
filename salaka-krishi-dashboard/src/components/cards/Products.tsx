import MainCard from 'components/MainCard';
import {
    Box,
    CardContent,
    CardMedia,
    Chip,
    Divider,
    IconButton,
    Rating,
    Stack,
    Typography
} from '@mui/material';
import { Grid } from '@mui/system';
import {
    ProductAvailability,
    ProductSchema,
    ProductStatus
} from 'schema/product';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deleteProduct } from 'api/product';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { usePathname, useRouter } from 'next/navigation';


interface ProductCardProps {
    product: ProductSchema;
}
export default function ProductCard({
    product
}: ProductCardProps) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const currencyType = process.env.NEXT_PUBLIC_CURRENCY_TYPE;
    const priceAfterDiscount = product.discountPercentage ? product.price - (product.price * product.discountPercentage) / 100 : product.price;
    const isDiscounted = !!product.discountPercentage && product.discountPercentage > 0;

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await deleteProduct(id);
            return rest.data;
        }
    });

    const queryClient = useQueryClient();
    const handleDelete = () => {
        deleteMutation.mutate(product.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                toast.success('Product deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete product');
            }
        });
    }
    const router = useRouter();
    const currentUrl = usePathname();

    const handleEdit = () => {
        router.push(`${currentUrl}/${product.id}`);
    }
    return (
        <>
            <MainCard
                content={false}
                sx={{
                    '&:hover': {
                        transform: 'scale3d(1.02, 1.02, 1)',
                        transition: 'all .4s ease-in-out'
                    }
                }}>
                <Box sx={{
                    width: "100%",
                    m: 'auto'
                }}>
                    <CardMedia
                        sx={{ height: 250, textDecoration: 'none', opacity: product.stock > 0 ? 1 : 0.25 }}
                        image={`${baseUrl}/uploads/${product.imageUrls[0]}`}
                    />
                </Box>
                <Stack
                    direction="row"
                    sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'absolute', top: 0, pt: 1.75, pl: 2, pr: 1 }}>
                    {product.status === ProductStatus.INACTIVE && <Chip variant="light" color="error" size="small" label="Not Published" />}
                    {product.availability && <Chip variant="light" color={product.availability === ProductAvailability.OUT_OF_STOCK ? "error" : product.availability === ProductAvailability.PREORDER ? "warning" : "success"} size="small" label={product.availability} />}
                    {isDiscounted && <Chip label={`${product.discountPercentage}% OFF`} variant="combined" color="success" size="small" />}
                </Stack>
                <Divider />
                <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
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
                                    onClick={handleEdit} sx={{
                                        width: "12px!important",
                                        height: "12px!important",
                                    }}>
                                    <EditIcon fontSize="inherit" />
                                </IconButton>
                            </Stack>
                        </Grid>

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
                                    {product.name}
                                </Typography>
                                <Typography variant="h6" sx={{
                                    color: 'text.secondary', display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}>
                                    {product.description}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={12}>
                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', row: 1.75 }}>
                                <Stack>
                                    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                                        <Typography variant="h5">{currencyType}{priceAfterDiscount}</Typography>
                                        {isDiscounted && <Typography variant="h6" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                                            {currencyType}.{product.price}
                                        </Typography>}
                                    </Stack>
                                    <Stack direction="row" sx={{ alignItems: 'flex-start' }}>
                                        <Rating precision={0.5} name="size-small" value={product.rating} size="small" readOnly />
                                        <Typography variant="caption">({product.rating?.toFixed(1)})</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </MainCard >
        </>
    );
}
