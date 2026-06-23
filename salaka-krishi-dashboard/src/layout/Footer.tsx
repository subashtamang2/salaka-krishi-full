import Link from 'next/link';
import Links from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';



export default function Footer() {
    return (
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', p: '24px 16px 0px', mt: 'auto' }}>
            <Typography variant="caption">
                &copy; Salaka Krishi crafted with  by{' '}
                <Links component={Link} href="https://www.yaksfilms.com.np/" target="_blank" underline="none">
                    {' '}
                    Yaks Films Production
                </Links>
            </Typography>
        </Stack>
    )
}
