import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext'; // 👈 Import your context

const Navbar = () => {
    // Get the current user and logout function from the context
    const { user, logout } = useContext(AuthContext);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    My App
                </Typography>

                {/* Use a ternary operator to show different buttons based on user state */}
                {user ? (
                    <>
                        {/* If the user exists AND their role is 'admin', show the button */}
                        {user.role === 'admin' && (
                            <Button color="inherit" component={Link} to="/admin">
                                Admin Panel
                            </Button>
                        )}

                            {user.role === 'villageAdmin' && (
                            <Button color="inherit" component={Link} to="/village-admin">
                                Village Admin Panel
                            </Button>
                        )}


                        <Button color="inherit" component={Link} to="/" onClick={logout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        {/* If no user, show Login and Register buttons */}
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