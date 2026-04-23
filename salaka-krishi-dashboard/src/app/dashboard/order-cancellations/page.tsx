"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Typography,
    Box,
    Link,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAllCancellations } from "api/order";
import MainCard from "components/MainCard";
import Loading from "app/loading";
import Error404 from "app/dashboard/error";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

function getCancelledByColor(cancelledBy: string): "error" | "warning" | "info" | "default" {
    switch (cancelledBy) {
        case "admin": return "warning";
        case "user": return "info";
        case "system": return "error";
        default: return "default";
    }
}

export default function OrderCancellationsPage() {
    const router = useRouter();

    const { data: cancellationsRes, isLoading, isError } = useQuery({
        queryKey: ["all-cancellations"],
        queryFn: async () => (await getAllCancellations()).data,
    });

    if (isLoading) return <Loading />;
    if (isError) return <Error404 title="Failed to load cancellations" />;

    const cancellations = cancellationsRes?.data || cancellationsRes || [];

    return (
        <>
            <Box mb={3}>
                <Typography variant="h4" fontWeight={700}>Order Cancellations</Typography>
                <Typography variant="body2" color="text.secondary">Track all cancelled orders with reasons and details.</Typography>
            </Box>

            <MainCard content={false}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Note</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="center">Cancelled By</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="center">Amount</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cancellations.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body1" color="text.secondary" py={6}>No cancellations found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                            {cancellations.map((c: any) => (
                                <TableRow key={c.id} hover sx={{ cursor: "pointer" }}>
                                    <TableCell>
                                        <Link
                                            component="button"
                                            variant="body2"
                                            fontWeight={700}
                                            color="primary"
                                            underline="hover"
                                            onClick={() => router.push(`/dashboard/orders/${c.orderId}`)}
                                        >
                                            {c.order?.orderNumber || "—"}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>
                                            {c.order?.user?.firstName} {c.order?.user?.lastName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {c.order?.user?.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={c.reason} size="small" color="error" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {c.note || "—"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={c.cancelledBy}
                                            size="small"
                                            color={getCancelledByColor(c.cancelledBy)}
                                            variant="combined"
                                            sx={{ textTransform: "capitalize", fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" fontWeight={600}>
                                            Rs. {c.order?.total?.toLocaleString() || "—"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2">
                                            {format(new Date(c.createdAt), "MMM dd, yyyy")}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {format(new Date(c.createdAt), "hh:mm a")}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
        </>
    );
}
