'use client';

import {
    Box,
    Button,
    Chip,
    Collapse,
    Divider,
    LinearProgress,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getFaq } from 'api/faq';
import MainCard from 'components/MainCard';
import { FaqCategory, FaqSchema } from 'schema/faq';
import { DataWrapper } from 'schema/schema';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categoryColors: Record<
    string,
    'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
    General: 'info',
    Shipping: 'success',
    Returns: 'error',
    Payments: 'warning',
    Products: 'secondary',
};

function SingleFaqRow({ faq }: { faq: FaqSchema }) {
    const [open, setOpen] = useState(false);
    return (
        <Box
            sx={{
                borderRadius: 1.5,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                mb: 1,
            }}
        >
            <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                px={1.5}
                py={1.25}
                onClick={() => setOpen(!open)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, transition: 'background 0.2s' }}
            >
                <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                        flex: 1,
                        pr: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: open ? 'unset' : 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {faq.question}
                </Typography>
                <ExpandMoreIcon
                    sx={{
                        fontSize: 18,
                        color: 'text.disabled',
                        flexShrink: 0,
                        mt: 0.25,
                        transition: 'transform 0.2s',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                />
            </Stack>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <Box px={1.5} py={1.25} sx={{ bgcolor: 'action.hover' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                        {faq.answer}
                    </Typography>
                </Box>
            </Collapse>
        </Box>
    );
}

function CategorySection({ category, faqs }: { category: string; faqs: FaqSchema[] }) {
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? faqs : faqs.slice(0, 3);
    const color = categoryColors[category] ?? 'default';

    return (
        <Box mb={2.5}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Chip label={category} color={color} size="small" variant="combined" sx={{ fontWeight: 700 }} />
                <Chip label={faqs.length} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
            </Stack>
            {visible.map((faq) => (
                <SingleFaqRow key={faq.id} faq={faq} />
            ))}
            {faqs.length > 3 && (
                <Button
                    size="small"
                    variant="text"
                    onClick={() => setShowAll(!showAll)}
                    sx={{ textTransform: 'none', fontSize: '0.75rem', mt: 0.5 }}
                >
                    {showAll ? 'Show less' : `+${faqs.length - 3} more`}
                </Button>
            )}
        </Box>
    );
}

export default function FaqDashboardWidget() {
    const router = useRouter();

    const { data: faqList, isLoading } = useQuery<DataWrapper<FaqSchema[]>>({
        queryKey: ['faqs'],
        queryFn: async () => {
            const rest = await getFaq();
            return rest.data;
        },
    });

    const faqs = faqList?.data || [];

    // Group by category
    const grouped: Record<string, FaqSchema[]> = {};
    faqs.forEach((faq) => {
        if (!grouped[faq.category]) grouped[faq.category] = [];
        grouped[faq.category].push(faq);
    });

    const categories = Object.keys(grouped);
  
    return (
        <MainCard
            content={false}
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            {/* Header */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                px={2.5}
                py={2}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'primary.lighter',
                        }}
                    >
                        <HelpOutlineIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                            FAQ Overview
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isLoading ? '…' : `${faqs.length} questions across ${categories.length} categories`}
                        </Typography>
                    </Box>
                </Stack>
                <Button
                    size="small"
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => router.push('/dashboard/faq')}
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5, fontSize: '0.75rem' }}
                >
                    Manage
                </Button>
            </Stack>

            {/* Category progress bars */}
            {!isLoading && faqs.length > 0 && (
                <Box px={2.5} py={1.5} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stack spacing={1}>
                        {Object.values(FaqCategory).map((cat) => {
                            const count = grouped[cat]?.length ?? 0;
                            const pct = faqs.length > 0 ? (count / faqs.length) * 100 : 0;
                            const color = categoryColors[cat] ?? 'default';
                            return (
                                <Stack key={cat} direction="row" alignItems="center" spacing={1.5}>
                                    <Typography variant="caption" color="text.secondary" sx={{ width: 68, flexShrink: 0 }}>
                                        {cat}
                                    </Typography>
                                    <Box sx={{ flex: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={pct}
                                            color={color === 'default' ? 'primary' : color}
                                            sx={{ height: 6, borderRadius: 3 }}
                                        />
                                    </Box>
                                    <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ width: 22, textAlign: 'right', flexShrink: 0 }}>
                                        {count}
                                    </Typography>
                                </Stack>
                            );
                        })}
                    </Stack>
                </Box>
            )}

            {/* FAQ list body */}
            <Box
                px={2.5}
                py={2}
                sx={{ flex: 1, overflowY: 'auto', maxHeight: 420 }}
            >
                {isLoading ? (
                    <Stack spacing={1.5}>
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} variant="rounded" height={48} />
                        ))}
                    </Stack>
                ) : faqs.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <HelpOutlineIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.disabled">
                            No FAQs added yet.
                        </Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1.5, textTransform: 'none' }}
                            onClick={() => router.push('/dashboard/faq/add')}
                        >
                            Add First FAQ
                        </Button>
                    </Box>
                ) : (
                    categories.map((cat) => (
                        <CategorySection key={cat} category={cat} faqs={grouped[cat]} />
                    ))
                )}
            </Box>
        </MainCard>
    );
}
