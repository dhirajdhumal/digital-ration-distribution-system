import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext';
import './Navbar.css'; // 👈 Import the CSS file

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <AppBar position="static" className="navbar">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                >
                    My App
                </Typography>

                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <Button color="inherit" component={Link} to="/admin/dashboard">
                                Admin Panel
                            </Button>
                        )}
                        {user.role === 'villageAdmin' && (
                            <Button color="inherit" component={Link} to="/village-admin/dashboard">
                                Village Admin Panel
                            </Button>
                        )}
                        {user.role === 'user' && (
                            <Button color="inherit" component={Link} to="/user/dashboard">
                                Your Dashboard
                            </Button>
                        )}
                        <Button color="inherit" component={Link} to="/" onClick={logout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
