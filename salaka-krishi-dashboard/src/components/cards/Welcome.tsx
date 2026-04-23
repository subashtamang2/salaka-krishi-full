import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
const cardBack = '/assets/images/bg/img-dropbox-bg.svg';
const WelcomeImage = '/assets/images/logo/icon.svg';

export default function WelcomeBanner() {
    return (
        <MainCard
            border={false}
            sx={{
                color: 'background.paper',
                bgcolor: 'primary.darker',
                '&:after': {
                    content: '""',
                    background: `url("${cardBack}") 100% 100% / cover no-repeat`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                    opacity: 0.5
                }
            }}>
            <Grid container>
                <Grid size={{ md: 6, sm: 6, xs: 12 }}>
                    <Stack sx={{ gap: 2, padding: 3 }}>
                        <Typography variant="h2">Welcome To Salaka Krishi CMS</Typography>
                        <Typography variant="h6">
                            Welcome to Salaka Krishi, your go-to for agricultural excellence! Discover organic seeds, modern farming tools, and fresh produce.
                        </Typography>
                    </Stack>
                </Grid>
                <Grid sx={{ display: { xs: 'none', sm: 'initial' } }} size={{ sm: 6, xs: 12 }}>
                    <Stack sx={{ justifyContent: 'center', alignItems: 'flex-end', position: 'relative', pr: { sm: 3, md: 8 }, zIndex: 2 }}>
                        <CardMedia component="img" sx={{ width: 150 }} src={WelcomeImage} alt="Welcome" />
                    </Stack>
                </Grid>
            </Grid>
        </MainCard >
    );
}
