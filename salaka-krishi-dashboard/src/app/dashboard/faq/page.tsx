"use client";

import {
    Box,
    Typography,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
} from "@mui/material";
import {Edit, Trash, ArrowDown2 } from "@wandersonalwes/iconsax-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "api/axios-interceptor";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useConfirm } from "components/ConfirmDialog";

export default function FAQListPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const confirm = useConfirm();

    const { data: faqGroupedData, isLoading, error } = useQuery({
        queryKey: ["faqs"],
        queryFn: async () => {
            const response = await axios.get("/faq");
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`/faq/${id}`);
        },
        onSuccess: () => {
            toast.success("FAQ deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
        onError: () => {
            toast.error("Failed to delete FAQ");
        },
    });

    const handleDelete = async (id: string) => {
        const ok = await confirm({
            title: "Delete FAQ",
            message: "Are you sure you want to delete this FAQ? This action cannot be undone.",
            confirmText: "Delete",
            variant: "danger",
        });
        if (ok) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Error fetching FAQs. Please try again later.</Typography>
            </Box>
        );
    }

    const categories = Array.isArray(faqGroupedData?.data) ? faqGroupedData.data : [];

    return (
        <Stack sx={{ gap: 3 }}>
            <ToastContainer position="top-right" autoClose={5000} />
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h3">FAQs</Typography>

            </Stack>

            {categories.length > 0 ? (
                categories.map((catGroup: any, index: number) => {
                    const faqs = Array.isArray(catGroup.faqs) ? catGroup.faqs : [];
                    return (
                        <Accordion key={index} defaultExpanded={index === 0} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ArrowDown2 size="20" />}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h5">{catGroup.category}</Typography>
                                    <Chip label={`${faqs.length} items`} size="small" color="primary" variant="outlined" />
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0, borderTop: '1px solid', borderColor: 'divider' }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: 'background.paper' } }}>
                                                <TableCell width="30%">Question</TableCell>
                                                <TableCell width="50%">Answer</TableCell>
                                                <TableCell align="right" width="20%">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {faqs.length > 0 ? (
                                                faqs.map((faq: any) => (
                                                    <TableRow key={faq.id} hover>
                                                        <TableCell>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                                                {faq.question}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Alias: {faq.slug}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            maxWidth: 400,
                                                            whiteSpace: 'normal',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            pt: 2.5
                                                        }}>
                                                            {faq.answer.replace(/<[^>]*>?/gm, '')}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                                                <IconButton
                                                                    color="primary"
                                                                    onClick={() => router.push(`/dashboard/faq/${faq.id}`)}
                                                                >
                                                                    <Edit size="18" />
                                                                </IconButton>
                                                                <IconButton
                                                                    color="error"
                                                                    onClick={() => handleDelete(faq.id)}
                                                                    disabled={deleteMutation.isPending}
                                                                >
                                                                    <Trash size="18" />
                                                                </IconButton>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                                        <Typography variant="body2" color="textSecondary">No FAQs found in this category.</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                    );
                })
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <Typography variant="h6">No FAQ categories found.</Typography>
                </Paper>
            )}
        </Stack>
    );
}
