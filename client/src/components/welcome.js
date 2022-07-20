import { Button, Container, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import App, { UserContext } from '../App';
import { setAuthToken } from '../utils/apicomm';

export const Welcome = ({ messageHeading, messagePara }) => {
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    console.log('Welcome Page');
    if (user) navigate('/Buy');
  }, [user, navigate]);

  return (
    <Container maxWidth="sm">
      <Typography
        component="h1"
        variant="h3"
        align="center"
        color="text.primary"
        gutterBottom
        marginTop={10}
      >
        {messageHeading || 'Have Old Books?'}
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        {messagePara ||
          'This Website provides you with a platform to Sell your Old Books or Buy it.'}
      </Typography>
      <Stack sx={{ p: 4 }} direction="row" spacing={2} justifyContent="center">
        <Button component={RouterLink} to="/sign-up" variant="contained">
          Sign Up
        </Button>
        <Button variant="outlined" component={RouterLink} to="/log-in">
          Log in
        </Button>
      </Stack>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        People collect a lot of books while pursuing their Education but some of
        them becomes useless to them after a while.
      </Typography>
    </Container>
  );
};
