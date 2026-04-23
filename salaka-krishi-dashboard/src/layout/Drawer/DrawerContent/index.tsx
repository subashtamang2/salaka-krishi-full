import { Box } from '@mui/system';
import NavUser from './NavUser';
import Navigation from './Navigation';

export default function DrawerContent() {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'space-between',

                }}>
                <>
                    <Navigation />
                </>
                <NavUser />
            </Box>
        </>
    );
}
