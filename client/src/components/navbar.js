import { AppBar, Button, CardMedia, Toolbar, Typography } from '@mui/material';
import logo from '../logo.jpg';
import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';

const Navbar = ({ toggleLoginout }) => {
  const [user, setUser] = useContext(UserContext);
  return (
    <AppBar>
      <Toolbar>
        <CardMedia
          component="img"
          src={logo}
          alt="logo"
          style={{ maxWidth: '2.2rem', position: 'fixed', left: '10px' }}
        ></CardMedia>
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
