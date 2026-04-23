'use client';
import Image from 'next/image';
import { useMediaQuery, useTheme } from '@mui/system';
import {
    Box,
    Grid,
    Stack,
    Typography
} from '@mui/material';

const error404 = '/assets/images/maintenance/img-error-404.svg'; // change image if needed

export default function Error404({
    title }: {
        title?: string
    }) {
    const theme = useTheme();
    const downSM = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '80vh' }} spacing={3}>
            <Grid item xs={12}>
                <Box sx={{ width: downSM ? 240 : 325 }}>
                    <Image
                        src={error404}
                        alt="Page Not Found"
                        width={downSM ? 350 : 396}
                        height={downSM ? 325 : 370}
                        style={{
                            maxWidth: '100%',
                            height: 'auto'
                        }}
                    />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Stack justifyContent="center" alignItems="center">
                    <Typography align="center" variant={downSM ? 'h2' : 'h1'}>
                        {title ?? "Page Not Found"}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" align="center" sx={{ width: { xs: '73%', sm: '70%' }, mt: 1 }}>
                        Sorry, the data you are looking for does not found.
                    </Typography>
                </Stack>
            </Grid>
        </Grid>
    );
}
