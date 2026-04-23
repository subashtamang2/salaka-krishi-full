'use client';

import { useEffect, ReactNode } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Drawer from './Drawer';
import Loader from 'components/Loader';
import {
    handlerDrawerOpen,
    useGetMenuMaster
} from 'utils/menu';
import {
    DRAWER_WIDTH,
    MenuOrientation
} from 'config';
import useConfig from 'hooks/useConfig';
import Footer from './Footer';
import Header from './Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { menuMasterLoading } = useGetMenuMaster();
    const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
    const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
    const { container, miniDrawer, menuOrientation } = useConfig();
    const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;
    useEffect(() => {
        if (!miniDrawer) {
            handlerDrawerOpen(!downXL);
        }
    }, [downXL]);
    if (menuMasterLoading) return <Loader />;
    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <Header />
            <Drawer />
            <Box component="main" sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, flexGrow: 1, p: { xs: 1, sm: 3 } }}>
                <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit', mb: isHorizontal ? 2 : 'inherit' }} />
                <Container
                    maxWidth={container && !downXL ? 'xl' : false}
                    sx={{
                        ...(container && !downXL && { px: { xs: 0, sm: 3 } }),
                        position: 'relative',
                        minHeight: 'calc(100vh - 124px)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                    {children}
                    <Footer />
                </Container>
            </Box>
        </Box>
    );
}
