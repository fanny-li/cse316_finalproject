import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import EditToolbar from './EditToolbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Logo from '../images/Logo.png';



export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
        store.newListCounter = 0;
        store.closeCurrentList();
    }

    const handleCloseList = () => {
        store.closeCurrentList();
    }

    const handleGuestLogin = () => {
        handleMenuClose();
        auth.guestLogin();

    }


    const menuId = 'primary-search-account-menu';
    const menuItemStyle = {
        backgroundColor: "#766BB8",
        justifyContent: "center",
        border: "1px solid white"
    }
    const menuItemTextStyle = {
        color: "white",
        textDecoration: "none",
    }

    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}

        >

            <MenuItem style={menuItemStyle} onClick={handleMenuClose}><Link style={menuItemTextStyle} to='/login/'>Login</Link></MenuItem>
            <MenuItem style={menuItemStyle} onClick={handleMenuClose}><Link style={menuItemTextStyle} to='/register/'>Create New Account</Link></MenuItem>
            <MenuItem style={menuItemStyle} onClick={handleGuestLogin}><Link style={menuItemTextStyle} to='/'>Continue as Guest</Link></MenuItem>

        </Menu>

    );
    const loggedInMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
    }

    let homeButtonStyling = {

        display: "flex"
    }

    if (store.modalActive) {
        homeButtonStyling = {
            "textDecoration": 'none',
            "color": "grey"
        }
    }

    const initialsStyle = {
        zIndex: 1,
        color: "black",
        width: 30,
        backgroundColor: "#BF40BF",
        padding: 5,
        border: "2pt solid black",
        borderRadius: "80%",

    }

    const guestStyle = {
        color: "purple",
        fontFamily: "Robaaaoto",
    }
    function getAccountMenu(loggedIn) {
        let userInitials = "";
        if (auth.guest) {
            userInitials = "Guest";
        }
        else {
            userInitials = auth.getUserInitials();
        }
        console.log("userInitials: " + userInitials);
        if (loggedIn)
            return <div onClick={() => console.log("here")} style={auth.guest ? guestStyle : initialsStyle}>{userInitials}</div>;
        else
            return <AccountCircle style={{ color: "purple" }} />;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color=''>
                <Toolbar>
                    <Typography
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                        style={{ zIndex: 1 }}
                        onClick={handleCloseList}
                    >
                        <Link style={homeButtonStyling} to='/'>
                            <img src={Logo} alt='logo' width={150} />
                        </Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}

                        >
                            {getAccountMenu(auth.loggedIn)}
                        </IconButton>

                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}