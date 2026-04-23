import MainCard from 'components/MainCard';
import {
    Box,
    CardContent,
    Chip,
    IconButton,
    Stack,
    Typography
} from '@mui/material';
import { Grid } from '@mui/system';
import {
} from 'schema/product';
import { CouponSchema, CouponType } from 'schema/coupon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCoupon } from 'api/coupon';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { usePathname, useRouter } from 'next/navigation';




interface CardProps {
    coupon: CouponSchema;
}
export default function CouponCard({
    coupon
}: CardProps) {
    const isExprired = coupon.expiryDate ? new Date(coupon.expiryDate) < new Date() : false;
    const isUpcoming = coupon.startDate ? new Date(coupon.startDate) > new Date() : false;
    const isActive = !isExprired && !isUpcoming;
    const isUsageLimitReached = (coupon?.maxUsageLimit ?? 0) >= coupon.usageCount;
    const currencyType = process.env.NEXT_PUBLIC_CURRENCY_TYPE;


    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await deleteCoupon(id);
            return rest.data;
        }
    });

    const queryClient = useQueryClient();
    const handleDelete = () => {
        deleteMutation.mutate(coupon.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['coupons'] });
                toast.success('Coupon deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete coupon');
            }
        });
    }
    const router = useRouter();
    const currentUrl = usePathname();

    const handleEdit = () => {
        router.push(`${currentUrl}/${coupon.id}`);
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
            <Box
                bgcolor={coupon.type === CouponType.FixedAmount ? 'error.main' : 'error.main'}
                sx={{
                    position: 'relative',
                    color: '#fff',
                    px: 2,
                    py: 0.5,
                    fontWeight: 'bold',
                    width: 'fit-content',
                    clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
                }}>
                {coupon.type === CouponType.FixedAmount ? `${currencyType}.${coupon.discount} OFF` :
                    `${coupon.discount}% OFF`}
            </Box>
            <Stack
                direction="row"
                sx={{
                    alignItems: 'center',
                    justifyContent: 'end',
                    width: '75%',
                    pt: 1.75,
                    pl: 2,
                    pr: 1,
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }}>
                {isExprired && <Chip variant="combined" color="error" size="small" label="Expired"></Chip>}
                {isUpcoming && <Chip variant="combined" color="warning" size="small" label="Upcoming"></Chip>}
                {!isUsageLimitReached && isActive && <Chip variant="combined" color="success" size="small" label="Active"></Chip>}
                {isUsageLimitReached && <Chip variant="combined" color="info" size="small" label="Usage Limit Reached"></Chip>}
            </Stack>
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={1}>
                    <Grid size={6} spacing={1}>
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
                                {coupon.code}
                            </Typography>
                            <Typography variant="h6" sx={{
                                color: 'text.secondary',
                            }}>
                                {coupon.startDate && `Starts: ${new Date(coupon.startDate).toLocaleDateString()} `} {coupon.expiryDate && ` | Expires: ${new Date(coupon.expiryDate).toLocaleDateString()}`}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid size={6} spacing={1}>
                        <Stack direction="row" justifyContent={"end"} spacing={2} px={2}>
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
                        </Stack>
                    </Grid>
                    <Grid size={12} spacing={1}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', row: 1.75 }}>
                            <Stack direction="column" sx={{ alignItems: 'start' }}>
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                    {`Minimum Purchase: `}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {coupon.minPurchaseAmount ? `${currencyType}${coupon.minPurchaseAmount}` : 'N/A'}
                                    </span>
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                    {`Max Discount Amount: `}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {coupon.maxDiscountAmount ? `${currencyType}${coupon.maxDiscountAmount}` : 'N/A'}
                                    </span>
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                    {`Max Usage Limit: `}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {coupon.maxUsageLimit ? `${coupon.maxUsageLimit}` : 'N/A'}
                                    </span>
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                    {`Use Count: `}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {coupon.usageCount ? `${coupon.usageCount}` : 0}
                                    </span>
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid size={12} spacing={1}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', row: 1.75 }}>
                            <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                    {`Created By: `}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {coupon.createdBy ? `${coupon.createdBy.firstName} ${coupon.createdBy.lastName ?? ""}` : 'N/A'}
                                    </span>
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                    {`Updated By: `}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {coupon.updatedBy ? `${coupon.updatedBy.firstName} ${coupon.updatedBy.lastName ?? ""}` : 'N/A'}
                                    </span>
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>




            </CardContent>
        </MainCard >
    );
}
