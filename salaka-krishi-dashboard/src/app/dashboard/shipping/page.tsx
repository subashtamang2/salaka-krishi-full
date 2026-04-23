"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getShippingDetails, deleteShippingDetail } from "api/shipping";
import MainCard from "components/MainCard";
import Loading from "app/loading";
import Error404 from "app/dashboard/error";
import { toast, ToastContainer } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "components/ConfirmDialog";

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function DeleteButton({ id }: { id: string }) {
    const queryClient = useQueryClient();
    const confirm = useConfirm();

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await deleteShippingDetail(id);
            return res.data;
        },
    });

    const handleDelete = async () => {
        const ok = await confirm({
            title: "Delete Shipping Detail",
            message: "Are you sure you want to delete this shipping detail? This action cannot be undone.",
            confirmText: "Delete",
            variant: "danger",
        });
        if (!ok) return;

        deleteMutation.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["shipping-details"] });
                toast.success("Shipping detail deleted successfully");
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Failed to delete";
                toast.error(message);
            },
        });
    };

    return (
        <Button
            variant="text"
            color="error"
            size="small"
            startIcon={<DeleteIcon fontSize="small" />}
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
        >
            Delete
        </Button>
    );
}

export default function ShippingDetailsPage() {
    const { data: shippingRes, isLoading, isError } = useQuery({
        queryKey: ["shipping-details"],
        queryFn: async () => {
            const res = await getShippingDetails();
            return res.data;
        },
    });

    if (isLoading) return <Loading />;
    if (isError) return <Error404 title="Failed to load shipping details" />;

    const shippingList = shippingRes?.data || shippingRes || [];

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <MainCard title="Shipping Details" content={false}>
                <TableContainer>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>SN</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shippingList.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body2" color="text.secondary" py={4}>
                                            No shipping details found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                            {shippingList.map((item: any, index: number) => (
                                <TableRow hover key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>
                                            {item.user?.firstName || ""} {item.user?.lastName || ""}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.user?.email || "—"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                            {item.address}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {item.phone}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(item.createdAt)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <DeleteButton id={item.id} />
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
