import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Profile from './Profile';
import { MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import FullScreen from './FullScreen';
import DrawerHeader from 'layout/Drawer/DrawerHeader';


export default function HeaderContent() {
    const { menuOrientation } = useConfig();
    const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
    return (
        <>
            {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
            <Box sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}>
                <FullScreen />
                <Profile />
            </Box>
        </>
    );
}
