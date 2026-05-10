"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Stack,
    Typography,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link,
    Switch,
    FormControlLabel,
    TextField,
    FormControl,
    InputLabel,
    useTheme,
    alpha,
    Pagination,
    InputAdornment
} from "@mui/material";
import { Refresh2, SearchNormal1 } from "@wandersonalwes/iconsax-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders, updateOrderStatus, cancelOrder, archiveOrder, unarchiveOrder, reopenOrder, OrderFilters } from "api/order";
import MainCard from "components/MainCard";
import Loading from "app/loading";
import Error404 from "app/dashboard/error";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered"];
const STATUS_FLOW = ["Pending", "Processing", "Shipped", "Delivered"];

const isCOD = (paymentProvider: string) => paymentProvider === "CashOnDelivery";

function getPaymentStatusColor(status: string): "warning" | "success" | "error" | "default" {
    switch (status) {
        case "Paid": return "success";
        case "Pending": return "warning";
        case "Failed": return "error";
        case "Refunded": return "error";
        default: return "default";
    }
}

// --------------- COD Delivery Confirmation Modal ---------------
interface CodConfirmModalProps {
    open: boolean;
    onYes: () => void;
    onNo: () => void;
    onCancel: () => void;
    loading: boolean;
}

function CodDeliveryConfirmModal({ open, onYes, onNo, onCancel, loading }: CodConfirmModalProps) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                Confirm Payment Collection
            </DialogTitle>
            <DialogContent sx={{ pt: 0 }}>
                <DialogContentText sx={{ fontSize: "0.95rem", color: "text.primary" }}>
                    Did you collect the payment from the customer?
                </DialogContentText>
                <Box
                    mt={2}
                    p={1.5}
                    borderRadius={1}
                    bgcolor="info.lighter"
                    border="1px solid"
                    borderColor="info.light"
                >
                    <Typography variant="caption" color="info.dark">
                        This order uses <strong>Cash on Delivery</strong>. Confirming payment will mark the order as fully paid.
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 1, gap: 1, flexDirection: "column" }}>
                <Button
                    onClick={onYes}
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled={loading}
                    size="large"
                    sx={{ fontWeight: 700 }}
                >
                    ✓ Yes, Payment Collected
                </Button>
                <Button
                    onClick={onNo}
                    variant="outlined"
                    color="warning"
                    fullWidth
                    disabled={loading}
                    sx={{ fontWeight: 600 }}
                >
                    ✗ No, Not Collected Yet
                </Button>
                <Button
                    onClick={onCancel}
                    color="inherit"
                    fullWidth
                    disabled={loading}
                    sx={{ fontSize: "0.8rem" }}
                >
                    Cancel — Keep Current Status
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --------------- Status Dropdown ---------------
function StatusDropdown({ orderId, currentStatus, paymentStatus, paymentProvider, isArchived }: any) {
    const [status, setStatus] = useState(currentStatus || "Pending");
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);
    const [codModalOpen, setCodModalOpen] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        setStatus(currentStatus || "Pending");
    }, [currentStatus]);

    const currentIdx = STATUS_FLOW.indexOf(currentStatus);
    const isDelivered = currentStatus === "Delivered";
    const isCancelled = currentStatus === "Cancelled";

    const mutation = useMutation({
        mutationFn: ({ newStatus, cashCollected }: { newStatus: string; cashCollected?: boolean }) =>
            updateOrderStatus(orderId, newStatus, cashCollected),
    });

    const commitStatusChange = (newStatus: string, cashCollected?: boolean) => {
        mutation.mutate({ newStatus, cashCollected }, {
            onSuccess: () => {
                setStatus(newStatus);
                queryClient.invalidateQueries({ queryKey: ["orders"] });
                toast.success(`Order marked as ${newStatus}`);
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Failed to update status");
            },
        });
    };

    const handleChange = (newStatus: string) => {
        // COD + Delivered → show payment confirmation modal
        if (isCOD(paymentProvider) && newStatus === "Delivered") {
            setPendingStatus(newStatus);
            setCodModalOpen(true);
            return;
        }

        // All other cases — apply directly
        commitStatusChange(newStatus);
        setStatus(newStatus);
    };

    const handleCodYes = () => {
        if (!pendingStatus) return;
        commitStatusChange(pendingStatus, true);
        setCodModalOpen(false);
        setPendingStatus(null);
    };

    const handleCodNo = () => {
        if (!pendingStatus) return;
        commitStatusChange(pendingStatus, false);
        setCodModalOpen(false);
        setPendingStatus(null);
    };

    const handleCodCancel = () => {
        setCodModalOpen(false);
        setPendingStatus(null);
    };

    if (isCancelled) {
        return (
            <Chip
                label="Cancelled"
                color="error"
                size="small"
                sx={{ borderRadius: "6px", fontWeight: 700, minWidth: 140 }}
            />
        );
    }

    return (
        <>
            <Tooltip title={isDelivered ? "Delivered is final. Use Reopen to change." : ""}>
                <span>
                    <Select
                        size="small"
                        value={status}
                        onChange={(e) => handleChange(e.target.value)}
                        disabled={isDelivered || isArchived || mutation.isPending}
                        sx={{ minWidth: 140, fontSize: "0.85rem", "& .MuiSelect-select": { py: 0.5 } }}
                    >
                        {ORDER_STATUSES.map((s) => {
                            const targetIdx = STATUS_FLOW.indexOf(s);
                            const isBackward = targetIdx !== -1 && currentIdx !== -1 && targetIdx <= currentIdx;
                            return (
                                <MenuItem key={s} value={s} disabled={isBackward} sx={{ fontSize: "0.85rem" }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <span>{s}</span>
                                    </Stack>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </span>
            </Tooltip>

            <CodDeliveryConfirmModal
                open={codModalOpen}
                onYes={handleCodYes}
                onNo={handleCodNo}
                onCancel={handleCodCancel}
                loading={mutation.isPending}
            />
        </>
    );
}



interface ConfirmDialogProps {
    open: boolean;
    type: string;
    onClose: () => void;
    onConfirm: (opts?: any) => void;
    title: string;
    description: string;
    loading: boolean;
    color?: "error" | "primary" | "warning";
    showCodReset?: boolean;
}

function ConfirmActionDialog({ open, type, onClose, onConfirm, title, description, loading, color = "primary", showCodReset }: ConfirmDialogProps) {
    const [resetCod, setResetCod] = useState(false);
    const [reason, setReason] = useState("Changed mind");
    const [note, setNote] = useState("");

    const handleConfirm = () => {
        let opts: any = {};
        if (type === "reopen") opts.resetCodPayment = resetCod;
        if (type === "cancel") {
            opts.reason = reason;
            opts.note = note;
        }
        onConfirm(opts);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>

                {type === "cancel" && (
                    <Box mt={3} display="flex" flexDirection="column" gap={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Cancellation Reason</InputLabel>
                            <Select
                                value={reason}
                                label="Cancellation Reason"
                                onChange={(e) => setReason(e.target.value as string)}
                            >
                                <MenuItem value="Changed mind">Changed mind</MenuItem>
                                <MenuItem value="Delay">Delay</MenuItem>
                                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                                <MenuItem value="Wrong Item">Wrong Item</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Additional Notes (Optional)"
                            multiline
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            fullWidth
                        />
                    </Box>
                )}

                {showCodReset && (
                    <Box mt={2} p={2} borderRadius={1} bgcolor="warning.lighter" border="1px solid" borderColor="warning.light">
                        <FormControlLabel
                            control={<Switch checked={resetCod} onChange={(e) => setResetCod(e.target.checked)} color="warning" size="small" />}
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>Reset COD Payment Status</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Enable if cash was NOT collected (mistake delivery). This will revert payment to Pending.
                                    </Typography>
                                </Box>
                            }
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit" disabled={loading}>Cancel</Button>
                <Button onClick={handleConfirm} variant="contained" color={color} disabled={loading} autoFocus>
                    {loading ? "Processing..." : "Confirm"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --------------- Main Orders Page ---------------
export default function OrdersPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const theme = useTheme();

    // Filter state
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
    const [paymentProviderFilter, setPaymentProviderFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [limit] = useState(15);
    const [includeArchived, setIncludeArchived] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const filters: OrderFilters = {
        search: debouncedSearch || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        payment_status: paymentStatusFilter !== "All" ? paymentStatusFilter : undefined,
        payment_provider: paymentProviderFilter !== "All" ? paymentProviderFilter : undefined,
        includeArchived: includeArchived || undefined,
        page,
        limit,
    };

    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean; type: string; orderId: string; paymentProvider?: string; orderStatus?: string;
    }>({ open: false, type: "", orderId: "" });

    const { data: ordersRes, isLoading, isError } = useQuery({
        queryKey: ["orders", filters],
        queryFn: async () => (await getOrders(filters)).data,
    });

    const actionMutation = useMutation({
        mutationFn: async ({ type, id, opts }: { type: string; id: string; opts?: any }) => {
            if (type === "cancel") return cancelOrder(id, opts?.reason || "Cancelled by Admin", opts?.note);
            if (type === "archive") return archiveOrder(id);
            if (type === "unarchive") return unarchiveOrder(id);
            if (type === "reopen") return reopenOrder(id, opts?.resetCodPayment ?? false);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            const labels: any = { cancel: "cancelled", archive: "archived", unarchive: "restored", reopen: "reopened" };
            toast.success(`Order ${labels[variables.type]} successfully`);
            setConfirmDialog({ ...confirmDialog, open: false });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Action failed");
        }
    });

    if (isLoading) return <Loading />;
    if (isError) return <Error404 title="Failed to load orders" />;

    const orders = ordersRes?.data || ordersRes || [];
    const totalOrders = ordersRes?.total || orders.length;
    const totalPages = Math.ceil(totalOrders / limit);



    const handleAction = (type: string, order: any) => {
        setConfirmDialog({ open: true, type, orderId: order.id, paymentProvider: order.paymentProvider, orderStatus: order.orderStatus });
    };

    const getDialogConfig = () => {
        const isCodOrder = isCOD(confirmDialog.paymentProvider || "");
        const isReopeningDelivered = confirmDialog.type === "reopen" && confirmDialog.orderStatus === "Delivered";
        switch (confirmDialog.type) {
            case "cancel": return { title: "Cancel Order", desc: "Are you sure? This will restore stock.", color: "error" as const, showCodReset: false };
            case "archive": return { title: "Archive Order", desc: "This hides the order from main list. Find it in archives.", color: "warning" as const, showCodReset: false };
            case "unarchive": return { title: "Restore Order", desc: "This will move the order back to the main list.", color: "primary" as const, showCodReset: false };
            case "reopen": return {
                title: "Reopen Order",
                desc: "This will reset the order to 'Processing' state, allowing you to continue the workflow.",
                color: "primary" as const,
                showCodReset: isCodOrder && isReopeningDelivered
            };
            default: return { title: "", desc: "", color: "primary" as const, showCodReset: false };
        }
    };

    const dialog = getDialogConfig();

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000} />
            <Box mb={3}>
                <Typography
                    variant="h4"
                    fontWeight={700}>
                    Order Management
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary">
                    Monitor and process all customer orders.
                </Typography>
            </Box>

            {/* Filter Bar */}
            <MainCard sx={{ mb: 2 }}>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                        <TextField
                            size="small"
                            placeholder="Search order, customer, phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ minWidth: 260 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchNormal1 size={18} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                            <InputLabel>Status</InputLabel>
                            <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Processing">Processing</MenuItem>
                                <MenuItem value="Shipped">Shipped</MenuItem>
                                <MenuItem value="Delivered">Delivered</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>Pay Status</InputLabel>
                            <Select value={paymentStatusFilter} label="Pay Status" onChange={(e) => { setPaymentStatusFilter(e.target.value); setPage(1); }}>
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Failed">Failed</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>Payment</InputLabel>
                            <Select value={paymentProviderFilter} label="Payment" onChange={(e) => { setPaymentProviderFilter(e.target.value); setPage(1); }}>
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="CashOnDelivery">COD</MenuItem>
                                <MenuItem value="Esewa">eSewa</MenuItem>
                                <MenuItem value="Khalti">Khalti</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={includeArchived}
                                    onChange={(e) => {
                                        setIncludeArchived(e.target.checked);
                                        setPage(1);
                                    }}
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2" fontWeight={600} color={includeArchived ? "warning.main" : "text.secondary"}>
                                    View Archives
                                </Typography>
                            }
                            sx={{ ml: 1 }}
                        />
                    </Stack>
                </Stack>
            </MainCard>

            <MainCard content={false} sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 900, "& .MuiTableCell-root": { px: 1.5, py: 1.5 } }}>
                        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>SN</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Items</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Pay Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Order Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={11} align="center">
                                        <Typography variant="body1" color="text.secondary" py={6}>No orders found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                            {orders.map((order: any, index: number) => {
                                const canArchive = order.orderStatus === "Delivered" || order.orderStatus === "Cancelled";
                                return (
                                    <TableRow
                                        hover
                                        key={order.id}
                                        sx={{ "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) + " !important" }, transition: "background-color 0.2s" }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2">{(page - 1) * limit + index + 1}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                component="button"
                                                variant="body2"
                                                fontWeight={700}
                                                color="primary"
                                                onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                                                sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                                            >
                                                #{order.orderNumber}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>{order.fullName}</Typography>
                                            <Typography variant="caption" color="text.secondary">{order.phoneNumber}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip label={`${order.items?.length || 0} items`} size="small" variant="combined" color="primary" sx={{ fontWeight: 600, fontSize: "0.75rem" }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" fontWeight={700}>Rs. {order.total?.toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                {isCOD(order.paymentProvider) ? "Cash on Delivery" : order.paymentProvider}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={order.payment?.status || "Pending"}
                                                size="small"
                                                color={getPaymentStatusColor(order.payment?.status || "Pending") as any}
                                                variant="light"
                                                sx={{ borderRadius: "6px", fontWeight: 700, minWidth: 75 }}
                                            />
                                            {order.paymentDeadline && (order.payment?.status === 'Pending' || order.payment?.status === 'Failed') && order.orderStatus === 'Pending' && (
                                                <Typography 
                                                    variant="caption" 
                                                    color="error.main" 
                                                    sx={{ 
                                                        display: "block", 
                                                        mt: 0.5, 
                                                        fontSize: "0.65rem", 
                                                        fontWeight: 600,
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    Exp: {format(new Date(order.paymentDeadline), "hh:mm a")}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                                <StatusDropdown
                                                    orderId={order.id}
                                                    currentStatus={order.orderStatus}
                                                    paymentStatus={order.payment?.status}
                                                    paymentProvider={order.paymentProvider}
                                                    isArchived={order.isArchived}
                                                />
                                                {(order.orderStatus === "Cancelled" || order.orderStatus === "Delivered") && order.payment?.status !== "Failed" && !order.isArchived && (
                                                    <Tooltip title="Reopen Order">
                                                        <IconButton
                                                            size="small"
                                                            color="success"
                                                            onClick={() => handleAction("reopen", order)}
                                                            sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}
                                                        >
                                                            <Refresh2 size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", whiteSpace: "nowrap" }}>
                                                {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                                                {format(new Date(order.createdAt), "hh:mm a")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                justifyContent="center">
                                                {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
                                                    <Tooltip title="Cancel Order">
                                                        <Button
                                                            color="error"
                                                            size="small"
                                                            variant="text"
                                                            sx={{
                                                                px: 1,
                                                                minWidth: "auto",
                                                                fontSize: "0.75rem",
                                                                fontWeight: 700
                                                            }}
                                                            onClick={() => handleAction("cancel", order)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                                {order.isArchived ? (
                                                    <Tooltip title="Restore from Archive">
                                                        <Button
                                                            color="primary"
                                                            size="small"
                                                            variant="text"
                                                            sx={{ px: 1, minWidth: "auto", fontSize: "0.75rem", fontWeight: 700 }}
                                                            onClick={() => handleAction("unarchive", order)}
                                                        >
                                                            Restore
                                                        </Button>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title={canArchive ? "Archive" : "Only completed or cancelled orders can be archived"}>
                                                        <span>
                                                            <Button
                                                                color="warning"
                                                                size="small"
                                                                variant="text"
                                                                sx={{ px: 1, minWidth: "auto", fontSize: "0.75rem", fontWeight: 700 }}
                                                                onClick={() => handleAction("archive", order)}
                                                                disabled={!canArchive}
                                                            >
                                                                Archive
                                                            </Button>
                                                        </span>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {totalPages > 1 && (
                    <Stack direction="row" justifyContent="center" py={2}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, v) => setPage(v)}
                            color="primary"
                            shape="rounded"
                        />
                    </Stack>
                )}
            </MainCard>

            <ConfirmActionDialog
                open={confirmDialog.open}
                type={confirmDialog.type}
                onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
                onConfirm={(opts) => actionMutation.mutate({ type: confirmDialog.type, id: confirmDialog.orderId, opts })}
                title={dialog.title}
                description={dialog.desc}
                color={dialog.color}
                loading={actionMutation.isPending}
                showCodReset={dialog.showCodReset}
            />
        </>
    );
}
