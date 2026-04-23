"use client";

import { useState, MouseEvent } from 'react';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { useGetMenuMaster } from 'utils/menu';
import Avatar from 'components/@extended/Avatar';
import { ArrowRight2 } from '@wandersonalwes/iconsax-react';
import { clearLocalStorage } from 'api/local-storage';
import { userStore } from 'store/userStore';
import { useRouter } from 'next/navigation';


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
    drawerOpen: boolean;
}
const ExpandMore = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'theme' && prop !== 'expand' && prop !== 'drawerOpen'
})<ExpandMoreProps>(({ theme, expand, drawerOpen }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(-90deg)',
    marginLeft: 'auto',
    color: theme.palette.secondary.dark,
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
    }),
    ...(!drawerOpen && { opacity: 0, width: 50, height: 50 })
}));


export default function UserList() {
    const removeUser = userStore((state) => state.removeUser);
    const router = useRouter();
    const user = userStore((state) => state.user);

    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;

    const handleLogout = () => {
        clearLocalStorage();
        removeUser();
        router.push('/');
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ p: 1.25, px: !drawerOpen ? 1.25 : 3, borderTop: '2px solid ', borderTopColor: 'divider' }}>
            <List disablePadding>
                <ListItem
                    disablePadding
                    secondaryAction={
                        <ExpandMore
                            sx={{ svg: { height: 20, width: 20 } }}
                            expand={open}
                            drawerOpen={drawerOpen}
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            aria-label="show more">
                            <ArrowRight2 style={{ fontSize: '0.625rem' }} />
                        </ExpandMore>
                    }
                    sx={{
                        ...(!drawerOpen && { display: 'flex', justifyContent: 'flex-end' }),
                        '& .MuiListItemSecondaryAction-root': { right: !drawerOpen ? 16 : -16 }
                    }}>
                    <ListItemAvatar>
                        <Avatar
                            alt={`${user?.firstName} ${user?.lastName ?? ""}`}
                            src={user?.profileUrl ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${user.profileUrl}` : ""}
                            sx={{ ...(drawerOpen && { width: 46, height: 46 }) }}
                        />
                    </ListItemAvatar>
                    <ListItemText primary={`${user?.firstName} ${user?.lastName ?? ""}`} sx={{ ...(!drawerOpen && { display: 'none' }) }} secondary={user?.role} />
                </ListItem>
            </List>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Box>
    );
}
