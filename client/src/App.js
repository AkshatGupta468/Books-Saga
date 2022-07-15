import React, { useEffect, useLayoutEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Routes, useNavigate } from 'react-router-dom';
import EnterForm from './components/login';
import { getUserRequest, setAuthToken } from './utils/apicomm';
import {
  Box,
  Button,
  Container,
  Link,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { theme } from './utils/theme';
import Navbar from './components/navbar';
import { Link as RouterLink } from 'react-router-dom';
import { Copyright } from './components/copyright';

function App({ messageHeading, messagePara }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(true);
  const toggleLoginout = () => {
    if (user) {
      setAuthToken();
      window.sessionStorage.removeItem('token');
      window.localStorage.removeItem('token');
      setUser(null);
      setloading(false);
    } else {
      navigate('/log-in');
    }
  };
  useEffect(() => {
    setAuthToken(
      window.sessionStorage.getItem('token') ||
        window.localStorage.getItem('token')
    );
    getUserRequest()
      .then((userDetails) => {
        console.log('Logged In');
        console.log(userDetails);
        setUser(userDetails);
        setloading(false);
      })
      .catch((err) => {
        console.log('not logged in');
        setloading(false);
      });
  }, []);
  return (
    <ThemeProvider theme={theme}>
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
            mt: 10,
          }}
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 4,
              pb: 6,
            }}
          >
            {!loading ? (
              <Container maxWidth="sm">
                <Typography
                  component="h1"
                  variant="h3"
                  align="center"
                  color="text.primary"
                  gutterBottom
                >
                  {messageHeading || 'Have Old Books?'}
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="text.secondary"
                  paragraph
                >
                  {messagePara ||
                    'This Website provides you with a platform to Sell your Old Books or Buy it.'}
                </Typography>
                <Stack
                  sx={{ pt: 4 }}
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                >
                  {!user && (
                    <React.Fragment>
                      <Button
                        component={RouterLink}
                        to="/sign-up"
                        variant="contained"
                      >
                        Sign Up
                      </Button>
                      <Button variant="outlined" onClick={toggleLoginout}>
                        Log in
                      </Button>
                    </React.Fragment>
                  )}
                </Stack>
                {/* <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
                >
                People collect a lot of books while pursuing their Education but
                some of them becomes useless to them after a while.
              </Typography> */}
              </Container>
            ) : (
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={540}
                height={200}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
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
          <Link
            href="https://github.com/AkshatGupta468/Books-Saga"
            sx={{ p: 1 }}
          >
            GitHub
          </Link>
        </Typography>
        <Copyright />
      </Box>
    </ThemeProvider>
  );
}

export default App;
