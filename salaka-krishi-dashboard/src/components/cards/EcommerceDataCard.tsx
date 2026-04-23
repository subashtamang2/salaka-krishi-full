'use client';

import { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { ColorProps } from 'types/extended';

interface Props {
    title: string;
    count: number | string;
    icon: ReactNode;
    color?: ColorProps;
    isCurrency?: boolean;
}

export default function EcommerceDataCard({ title, count, icon, color = 'primary', isCurrency = false }: Props) {
    const formattedCount = isCurrency
        ? `Rs. ${Number(count).toLocaleString('en-NP', { minimumFractionDigits: 0 })}`
        : Number(count).toLocaleString();

    return (
        <MainCard>
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                        variant="rounded"
                        color={color}
                        type="combined"
                        size="lg"
                        sx={{ '& svg': { width: 24, height: 24 } }}
                    >
                        {icon}
                    </Avatar>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mt: 0.25 }}>
                            {formattedCount}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </MainCard>
    );
}
