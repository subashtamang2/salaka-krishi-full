'use client';

import {
    Box,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { usePathname, useRouter } from 'next/navigation';
import { FaqSchema } from 'schema/faq';
import { deleteFaq } from 'api/faq';
import MainCard from 'components/MainCard';
import { useConfirm } from 'components/ConfirmDialog';

interface FAQCardProps {
    faq: FaqSchema;
    index?: number;
}

export default function FAQ({ faq, index = 0 }: FAQCardProps) {
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const rest = await deleteFaq(id);
            return rest.data;
        }
    });

    const queryClient = useQueryClient();
    const confirm = useConfirm();
    const handleDelete = async () => {
        const ok = await confirm({
            title: "Delete FAQ",
            message: "Are you sure you want to delete this FAQ? This action cannot be undone.",
            confirmText: "Delete",
            variant: "danger",
        });
        if (!ok) return;
        deleteMutation.mutate(faq.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['faqs'] });
                toast.success('FAQ deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete FAQ');
            }
        });
    };

    const router = useRouter();
    const currentUrl = usePathname();

    const handleEdit = () => {
        router.push(`${currentUrl}/${faq.id}`);
    };

    return (
        <MainCard content={false} sx={{ borderRadius: 1 }}>
            <Stack direction="row" px={2} py={2} spacing={2} alignItems="flex-start">
                <Box sx={{ minWidth: 30, display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        #{index + 1}
                    </Typography>
                </Box>
                <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight={700} mb={1}>
                        {faq.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                        {faq.answer}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexShrink={0}>
                    <IconButton size="small" onClick={handleEdit} sx={{ color: 'primary.main' }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={handleDelete} disabled={deleteMutation.isPending} sx={{ color: 'error.main' }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Stack>
        </MainCard>
    );
}
