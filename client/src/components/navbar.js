import {
  AppBar,
  Button,
  IconButton,
  SvgIcon,
  Toolbar,
  Typography,
} from '@mui/material';
import logo from '../logo.png';
import React, { useEffect } from 'react';
const Navbar = ({ toggleLoginout, user }) => {
  useEffect(() => {
    console.log(user);
  });
  return (
    <AppBar>
      <Toolbar>
        <img
          src={logo}
          alt="logo"
          style={{ maxWidth: '2.2rem', position: 'fixed', left: '10px' }}
        ></img>
        <Typography variant="h6" component="div" sx={{ margin: 'auto' }}>
          Books Saga
        </Typography>
        {user && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={toggleLoginout}
            size="small"
            sx={{ position: 'fixed', right: '10px' }}
          >
            Log Out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
