"use client";


import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Stack,
    Typography,
    Divider,
    Button,
    Box,
} from "@mui/material";
import { ArrowLeft } from "@wandersonalwes/iconsax-react";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "api/order";
import MainCard from "components/MainCard";
import Loading from "app/loading";
import Error404 from "app/dashboard/error";
import { ToastContainer } from "react-toastify";
import { useRouter, useParams } from "next/navigation";






function getPaymentColor(status: string): "warning" | "success" | "error" | "default" {
    switch (status) {
        case "Pending": return "warning";
        case "Paid": return "success";
        case "Failed": return "error";
        case "Refunded": return "error";
        default: return "default";
    }
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function InfoRow({ label, value }: { label: string; value: string | number | undefined }) {
    return (
        <Stack direction="row" justifyContent="space-between" py={1}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" fontWeight={600}>{value ?? "—"}</Typography>
        </Stack>
    );
}

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: orderRes, isLoading, isError } = useQuery({
        queryKey: ["order", id],
        queryFn: async () => {
            const res = await getOrderById(id);
            return res.data;
        },
        enabled: !!id,
    });

    const order = orderRes?.data || orderRes;
    const cancellations = order?.cancellations || [];

    if (isLoading) return <Loading />;
    if (isError || !order) return <Error404 title="Order not found" />;

    const currentStatus = order.orderStatus;

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <Button
                    variant="text"
                    startIcon={<ArrowLeft size={18} />}
                    onClick={() => router.push("/dashboard/orders")}
                >
                    Back to Orders
                </Button>
            </Stack>

            <Grid container spacing={3}>
                {/* Order Summary */}
                <Grid item xs={12} md={8}>
                    <MainCard title={`Order #${order.orderNumber}`}>
                        <Stack spacing={0.5}>
                            <InfoRow label="Order Date" value={formatDate(order.createdAt)} />
                            <Divider />
                            <InfoRow label="Payment Method" value={order.paymentMethod} />
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" alignItems="center" py={1}>
                                <Typography variant="body2" color="text.secondary">Payment Status</Typography>
                                <Chip label={order.paymentStatus} size="small" color={getPaymentColor(order.paymentStatus)} variant="combined" />
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" alignItems="center" py={1}>
                                <Typography variant="body2" color="text.secondary">Order Status</Typography>
                                <Chip
                                    label={currentStatus}
                                    size="small"
                                    variant="combined"
                                    sx={{ fontWeight: 700 }}
                                    color={
                                        currentStatus === "Cancelled" ? "error" :
                                        currentStatus === "Delivered" ? "success" :
                                        currentStatus === "Shipped" ? "info" :
                                        currentStatus === "Processing" ? "primary" :
                                        "warning"
                                    }
                                />
                            </Stack>
                            <Divider />
                            <InfoRow label="Subtotal" value={`Rs. ${order.subTotal?.toLocaleString()}`} />
                            <InfoRow label="Discount" value={`Rs. ${order.discount?.toLocaleString() || 0}`} />
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" py={1}>
                                <Typography variant="h5">Total</Typography>
                                <Typography variant="h5" color="primary">Rs. {order.total?.toLocaleString()}</Typography>
                            </Stack>
                        </Stack>
                    </MainCard>

                    {order.orderStatus === "Cancelled" && cancellations.length > 0 && (
                        <Box mt={3}>
                            <MainCard title="Cancellation History" sx={{ borderColor: "error.main" }}>
                                <Stack spacing={2}>
                                    {cancellations.map((cancel: any) => (
                                        <Box key={cancel.id} p={2} bgcolor="error.lighter" borderRadius={2}>
                                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                                <Typography variant="body2" fontWeight={700} color="error.dark">
                                                    Reason: {cancel.reason}
                                                </Typography>
                                                <Typography variant="caption" color="error.dark">
                                                    {formatDate(cancel.createdAt)}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" mb={1}>
                                                <Typography component="span" fontWeight={600}>Cancelled By: </Typography>
                                                <Typography component="span" sx={{ textTransform: "capitalize" }}>{cancel.cancelledBy}</Typography>
                                            </Typography>
                                            {cancel.note && (
                                                <Typography variant="body2" color="text.secondary">
                                                    <Typography component="span" fontWeight={600}>Note: </Typography>
                                                    {cancel.note}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                            </MainCard>
                        </Box>
                    )}
                </Grid>

                {/* Customer & Shipping Info */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        <MainCard title="Customer Info">
                            <Stack spacing={0.5}>
                                <InfoRow label="Name" value={order.fullName} />
                                <Divider />
                                <InfoRow label="Email" value={order.user?.email} />
                                <Divider />
                                <InfoRow label="Phone" value={order.phoneNumber} />
                            </Stack>
                        </MainCard>

                        <MainCard title="Shipping Address">
                            <Typography variant="body2">{order.address}</Typography>
                        </MainCard>
                    </Stack>
                </Grid>

                {/* Order Items */}
                <Grid item xs={12}>
                    <MainCard title="Order Items" content={false}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>SN</TableCell>
                                        <TableCell>Product</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="center">Qty</TableCell>
                                        <TableCell align="right">Subtotal</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.items?.map((item: any, index: number) => (
                                        <TableRow hover key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {item.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                Rs. {item.price?.toLocaleString()}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={item.quantity} size="small" variant="combined" color="primary" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight={600}>
                                                    Rs. {(item.price * item.quantity)?.toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!order.items || order.items.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography variant="body2" color="text.secondary" py={2}>
                                                    No items
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 2, textAlign: "right" }}>
                            <Typography variant="h5">
                                Grand Total: <Typography component="span" variant="h5" color="primary">Rs. {order.total?.toLocaleString()}</Typography>
                            </Typography>
                        </Box>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    );
}
