"use client";

import { useState } from "react";
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
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Tabs,
    Tab,
    Tooltip,
    alpha,
    useTheme,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import MainCard from "components/MainCard";
import Loading from "app/loading";
import Error404 from "app/dashboard/error";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns";
import { approvePaymentProof, getAllPaymentProofs, getPendingPaymentProofs, rejectPaymentProof } from "api/payment-proof";

// ── Helper colours ──────────────────────────────────────────────────────────

function getStatusChip(status: string) {
    switch (status) {
        case "Approved":
            return <Chip label="Approved" color="success" size="small" sx={{ fontWeight: 700 }} />;
        case "Rejected":
            return <Chip label="Rejected" color="error" size="small" sx={{ fontWeight: 700 }} />;
        default:
            return <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: 700 }} />;
    }
}

function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return "—";
    try {
        return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
    } catch {
        return dateStr;
    }
}

// ── Confirm action modal ────────────────────────────────────────────────────

interface ActionModalProps {
    open: boolean;
    type: "approve" | "reject";
    onConfirm: (note: string) => void;
    onCancel: () => void;
    loading: boolean;
}

function ActionModal({ open, type, onConfirm, onCancel, loading }: ActionModalProps) {
    const [note, setNote] = useState("");

    const isApprove = type === "approve";

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                {isApprove ? "✅ Approve Payment Proof" : "❌ Reject Payment Proof"}
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
                <DialogContentText sx={{ fontSize: "0.92rem", color: "text.secondary", mb: 2 }}>
                    {isApprove
                        ? "Approving this proof will finalize the order and mark payment as Paid."
                        : "Rejecting this proof will cancel the order and restore stock."}
                </DialogContentText>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Admin Note (optional)"
                    placeholder="Add a note for your records..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    size="small"
                />
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onCancel} color="inherit" disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={() => onConfirm(note)}
                    variant="contained"
                    color={isApprove ? "success" : "error"}
                    disabled={loading}
                    sx={{ fontWeight: 700 }}
                >
                    {loading ? "Processing…" : isApprove ? "Approve" : "Reject"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ── Screenshot preview dialog ───────────────────────────────────────────────

interface PreviewDialogProps {
    open: boolean;
    url: string;
    onClose: () => void;
}

function ScreenshotPreviewDialog({ open, url, onClose }: PreviewDialogProps) {
    const apiBase =
        typeof window !== "undefined"
            ? (process.env.NEXT_PUBLIC_BACKEND_URL || "")
            : "";

    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    const fullUrl = url.startsWith("http") ? url : `${apiBase}${cleanUrl}`;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>Payment Screenshot</DialogTitle>
            <DialogContent sx={{ textAlign: "center", pb: 3 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={fullUrl}
                    alt="Payment Screenshot"
                    style={{
                        maxWidth: "100%",
                        maxHeight: 500,
                        objectFit: "contain",
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Close
                </Button>
                <Button href={fullUrl} target="_blank" rel="noreferrer" variant="outlined" size="small">
                    Open in New Tab
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function PaymentProofsPage() {
    const theme = useTheme();
    const queryClient = useQueryClient();

    const [tab, setTab] = useState<"pending" | "all">("pending");
    const [actionModal, setActionModal] = useState<{
        open: boolean;
        type: "approve" | "reject";
        proofId: string;
    }>({ open: false, type: "approve", proofId: "" });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // ── Queries ──────────────────────────────────────────────────────────────

    const {
        data: pendingData,
        isLoading: pendingLoading,
        isError: pendingError,
    } = useQuery({
        queryKey: ["payment-proofs", "pending"],
        queryFn: async () => {
            const res = await getPendingPaymentProofs();
            return res.data?.data || [];
        },
        refetchInterval: 30_000,
    });

    const {
        data: allData,
        isLoading: allLoading,
        isError: allError,
    } = useQuery({
        queryKey: ["payment-proofs", "all"],
        queryFn: async () => {
            const res = await getAllPaymentProofs();
            return res.data?.data || [];
        },
        enabled: tab === "all",
    });

    // ── Mutations ────────────────────────────────────────────────────────────

    const approveMutation = useMutation({
        mutationFn: ({ id, note }: { id: string; note: string }) =>
            approvePaymentProof(id, note || undefined),
        onSuccess: () => {
            toast.success("Payment proof approved. Order finalized!");
            queryClient.invalidateQueries({ queryKey: ["payment-proofs"] });
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to approve proof.");
        },
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, note }: { id: string; note: string }) =>
            rejectPaymentProof(id, note || undefined),
        onSuccess: () => {
            toast.success("Payment proof rejected. Order cancelled.");
            queryClient.invalidateQueries({ queryKey: ["payment-proofs"] });
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to reject proof.");
        },
    });

    // ── Handlers ─────────────────────────────────────────────────────────────

    const openModal = (type: "approve" | "reject", proofId: string) => {
        setActionModal({ open: true, type, proofId });
    };

    const closeModal = () => {
        setActionModal({ open: false, type: "approve", proofId: "" });
    };

    const handleConfirm = (note: string) => {
        const { proofId, type } = actionModal;
        if (type === "approve") {
            approveMutation.mutate({ id: proofId, note });
        } else {
            rejectMutation.mutate({ id: proofId, note });
        }
    };

    // ── Derived data ─────────────────────────────────────────────────────────

    const rows: any[] = tab === "pending"
        ? (pendingData || [])
        : (allData || []).filter((proof: any) => proof.status !== "Pending");
    const isLoading = tab === "pending" ? pendingLoading : allLoading;
    const isError = tab === "pending" ? pendingError : allError;
    const isActioning = approveMutation.isPending || rejectMutation.isPending;

    if (isLoading) return <Loading />;
    if (isError) return <Error404 />;

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            <MainCard
                title={
                    <Stack direction="row" alignItems="center" gap={1.5}>
                        <Typography variant="h5" fontWeight={700}>
                            Payment Proofs
                        </Typography>
                        {(pendingData?.length ?? 0) > 0 && (
                            <Chip
                                label={`${pendingData.length} Pending`}
                                color="warning"
                                size="small"
                                sx={{ fontWeight: 700 }}
                            />
                        )}
                    </Stack>
                }
            >
                {/* Tab switcher */}
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ mb: 2, borderBottom: "1px solid", borderColor: "divider" }}
                >
                    <Tab
                        label={
                            <Stack direction="row" alignItems="center" gap={0.8}>
                                Pending Review
                                {(pendingData?.length ?? 0) > 0 && (
                                    <Chip
                                        label={pendingData.length}
                                        color="warning"
                                        size="small"
                                        sx={{ height: 18, fontSize: "0.7rem", fontWeight: 700 }}
                                    />
                                )}
                            </Stack>
                        }
                        value="pending"
                    />
                    <Tab label="All Proofs" value="all" />
                </Tabs>

                <TableContainer sx={{ borderRadius: 1.5, border: "1px solid", borderColor: "divider" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                                <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Screenshot</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Submitted At</TableCell>
                                {tab === "all" && (
                                    <>
                                        <TableCell sx={{ fontWeight: 700 }}>Verified At</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Verified By</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Admin Note</TableCell>
                                    </>
                                )}
                                <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={tab === "all" ? 9 : 6} align="center">
                                        <Typography variant="subtitle1" color="text.secondary" sx={{ py: 6, fontWeight: 500 }}>
                                            {tab === "pending"
                                                ? " No pending payment proofs"
                                                : "No payment proofs found."}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((proof: any) => {
                                    const order = proof.order;
                                    const customer = order?.user;
                                    const isPending = proof.status === "Pending";

                                    return (
                                        <TableRow
                                            key={proof.id}
                                            hover
                                            sx={{
                                                "&:last-child td": { border: 0 },
                                                bgcolor: isPending
                                                    ? alpha(theme.palette.warning.light, 0.06)
                                                    : "inherit",
                                            }}
                                        >
                                            {/* Order info */}
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    #{order?.orderNumber || order?.id?.slice(-8) || "—"}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {order?.paymentProvider}
                                                </Typography>
                                            </TableCell>

                                            {/* Customer */}
                                            <TableCell>
                                                {customer ? (
                                                    <>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {customer.firstName} {customer.lastName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {customer.email}
                                                        </Typography>
                                                    </>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        —
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            {/* Screenshot */}
                                            <TableCell>
                                                {proof.screenshotUrl ? (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => setPreviewUrl(proof.screenshotUrl)}
                                                        sx={{ fontSize: "0.72rem" }}
                                                    >
                                                        View Screenshot
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">
                                                        —
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>{getStatusChip(proof.status)}</TableCell>

                                            {/* Submitted */}
                                            <TableCell>
                                                <Typography variant="caption">
                                                    {formatDate(proof.createdAt)}
                                                </Typography>
                                            </TableCell>

                                            {tab === "all" && (
                                                <>
                                                    {/* Verified at */}
                                                    <TableCell>
                                                        <Typography variant="caption">
                                                            {formatDate(proof.verifiedAt)}
                                                        </Typography>
                                                    </TableCell>

                                                    {/* Verified by */}
                                                    <TableCell>
                                                        {proof.payment?.verifiedBy ? (
                                                            <>
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {proof.payment.verifiedBy.firstName} {proof.payment.verifiedBy.lastName || ""}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {proof.payment.verifiedBy.email}
                                                                </Typography>
                                                            </>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">
                                                                —
                                                            </Typography>
                                                        )}
                                                    </TableCell>

                                                    {/* Admin note */}
                                                    <TableCell sx={{ maxWidth: 160 }}>
                                                        {proof.adminNote ? (
                                                            <Tooltip title={proof.adminNote} arrow>
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        display: "-webkit-box",
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: "vertical",
                                                                        overflow: "hidden",
                                                                        cursor: "help",
                                                                    }}
                                                                >
                                                                    {proof.adminNote}
                                                                </Typography>
                                                            </Tooltip>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">
                                                                —
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                </>
                                            )}

                                            {/* Actions */}
                                            <TableCell>
                                                {isPending ? (
                                                    <Stack direction="row" gap={1} justifyContent="center">
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="success"
                                                            sx={{ fontWeight: 700, minWidth: 80 }}
                                                            onClick={() => openModal("approve", proof.id)}
                                                            disabled={isActioning}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="error"
                                                            sx={{ fontWeight: 700, minWidth: 80 }}
                                                            onClick={() => openModal("reject", proof.id)}
                                                            disabled={isActioning}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Stack>
                                                ) : (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.disabled"
                                                        sx={{ display: "block", textAlign: "center" }}
                                                    >
                                                        {proof.status}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>

            {/* Approve / Reject Modal */}
            <ActionModal
                open={actionModal.open}
                type={actionModal.type}
                onConfirm={handleConfirm}
                onCancel={closeModal}
                loading={isActioning}
            />

            {/* Screenshot Preview */}
            {previewUrl && (
                <ScreenshotPreviewDialog
                    open={!!previewUrl}
                    url={previewUrl}
                    onClose={() => setPreviewUrl(null)}
                />
            )}
        </>
    );
}
