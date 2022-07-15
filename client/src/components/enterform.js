import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { signupRequest } from '../utils/apicomm';
import { Copyright } from './copyright';
import { theme } from '../utils/theme';

const EnterForm = ({
  pagename,
  isLoading,
  buttonname,
  handleSubmit,
  children,
  footlinks,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          pt: 8,
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {pagename}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {children}
            {['Sign Up', 'Log In'].includes(pagename) && (
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    id="rememberMe"
                    name="rememberMe"
                    defaultChecked
                  />
                }
                label="Remember me"
              />
            )}
            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              variant="contained"
              sx={{ mt: 3, mb: 2, position: 'relative' }}
            >
              {buttonname}
              {isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    // color: green[500],
                    position: 'absolute',
                    margin: 'auto',
                  }}
                />
              )}
            </Button>
          </Box>
          {footlinks}
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default EnterForm;
