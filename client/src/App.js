import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getUserRequest, setAuthToken } from './utils/apicomm';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Container,
  IconButton,
  Link as MuiLink,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { theme } from './utils/theme';
import Navbar from './components/navbar';
import { Link as RouterLink } from 'react-router-dom';
import { Copyright } from './components/copyright';
import { LandingPage } from './components/welcome';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import SellIcon from '@mui/icons-material/Sell';
import CloseIcon from '@mui/icons-material/Close';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Buy } from './components/buy';
import { Sell } from './components/sell';
import { ErrorHandler } from './utils/errorhandler';

export const UserContext = createContext();
export const SnackContext = createContext();
function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setloading] = useState(true);
  const [Snack, setSnack] = useState({ isopen: false, message: '' });

  const toggleLoginout = () => {
    if (user) {
      setloading(true);
      setAuthToken();
      window.sessionStorage.removeItem('token');
      window.localStorage.removeItem('token');
      setloading(false);
      setUser(null);
      navigate('/');
    } else {
      navigate('/log-in');
    }
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack({ isopen: false, message: '' });
  };
  useEffect(() => {
    setAuthToken(
      window.sessionStorage.getItem('token') ||
        window.localStorage.getItem('token')
    );
    if (!user) {
      getUserRequest()
        .then((user) => {
          setUser(user);
        })
        .catch((errors) => {
          if (errors) {
            if (errors.misc && errors.misc.name === 'NOT_LOGGED_IN') {
              delete errors.misc;
            }
            ErrorHandler(errors, navigate);
          }
        });
    }
    setloading(false);
  }, [user, navigate]);
  return (
    <React.Fragment>
      <UserContext.Provider value={[user, setUser]}>
        <SnackContext.Provider value={[Snack, setSnack]}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
            }}
          >
            <Navbar toggleLoginout={toggleLoginout} user={user} />
            <Box
              sx={{
                positon: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                mt: 8,
              }}
            >
              {!loading && <Outlet />}
              {loading && <Skeleton height="140"></Skeleton>}
              {user && (
                <React.Fragment>
                  <Paper
                    sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
                    elevation={3}
                  >
                    <BottomNavigation showLabels>
                      <BottomNavigationAction
                        label="Sell"
                        icon={<SellIcon />}
                        component={RouterLink}
                        to="/Sell"
                      />
                      <BottomNavigationAction
                        label="Buy"
                        icon={<ShoppingCartOutlinedIcon />}
                        component={RouterLink}
                        to="/Buy"
                      />
                      <BottomNavigationAction
                        label="Profile"
                        icon={<AccountBoxIcon />}
                        component={RouterLink}
                        to="/Profile"
                      />
                    </BottomNavigation>
                  </Paper>
                </React.Fragment>
              )}
            </Box>
          </Box>
          <Box
            sx={{ bgcolor: 'background.default', p: 3, pb: 10 }}
            component="footer"
          >
            {/* <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography> */}
            <Typography
              variant="subtitle1"
              align="center"
              color="text.secondary"
              component="p"
            >
              This site is an Open-Source project at
              <MuiLink
                href="https://github.com/AkshatGupta468/Books-Saga"
                sx={{ p: 1 }}
              >
                GitHub
              </MuiLink>
            </Typography>
            <Copyright />
          </Box>
          <Snackbar
            open={Snack.isopen}
            autoHideDuration={6000}
            onClose={handleClose}
            message={Snack.message}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        </SnackContext.Provider>
      </UserContext.Provider>
    </React.Fragment>
  );
}

export default App;
