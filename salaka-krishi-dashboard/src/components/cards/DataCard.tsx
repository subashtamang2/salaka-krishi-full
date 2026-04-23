'use client';

import { ReactNode } from 'react';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { ColorProps } from 'types/extended';

interface Props {
    title: string;
    count: string;
    iconPrimary: ReactNode;
    color?: ColorProps;
}


export default function DataCard({ title, count, color, iconPrimary }: Props) {
    return (
        <MainCard>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                            <Avatar variant="rounded" color={color}>
                                {iconPrimary}
                            </Avatar>
                            <Typography variant="h4">{title}</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid size={12}>
                    <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
                        <Box sx={{ p: 3, }}>
                            <Grid container spacing={3}>
                                <Grid size={12}>
                                    <Typography variant="h2" py={0} my={0} textAlign={"center"}>{count}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </MainCard>
                </Grid>
            </Grid>
        </MainCard>
    );
}
