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
import { IconButton, InputAdornment, Link } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { signupRequest } from '../utils/apicomm';
import { Copyright } from './copyright';
import EnterForm from './enterform';

const theme = createTheme();
const defaultFormState = {
  password: {
    error: false,
    helpertext: '',
  },
  email: {
    error: false,
    helpertext: '',
  },
  passwordConfirm: {
    error: false,
    helpertext: '',
  },
  name: {
    error: false,
    helpertext: '',
  },
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);
  const navigate = useNavigate();
  const changeHandler = (key) => {
    setFormState((prev) => {
      const newstate = {
        ...prev,
      };
      newstate[key].error = false;
      newstate[key].helpertext = '';
      return newstate;
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    signupRequest(data)
      .then((res) => {
        navigate('/');
      })
      .catch((errors) => {
        Object.keys(errors).forEach((key) => {
          setFormState((oldState) => {
            const newState = {
              ...oldState,
            };
            newState[key].error = true;
            newState[key].helpertext = errors[key].message;
            return newState;
          });
        });
        console.log(formState);
      });
  };

  return (
    <EnterForm
      pagename={'Sign Up'}
      buttonname={'Sign Up'}
      handleSubmit={handleSubmit}
      footlinks={
        <Grid container>
          <Grid item>
            <Link variant="body2" component={RouterLink} to="/log-in">
              {'Already have an account? Login'}
            </Link>
          </Grid>
        </Grid>
      }
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        error={formState.email.error}
        helperText={formState.email.helpertext}
        onChange={() => {
          changeHandler('email');
        }}
        autoFocus
        variant="filled"
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Name"
        name="name"
        error={formState.name.error}
        helperText={formState.name.helpertext}
        autoComplete="name"
        onChange={() => {
          changeHandler('name');
        }}
        variant="filled"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        error={formState.password.error}
        helperText={formState.password.helpertext}
        onChange={() => {
          changeHandler('password');
        }}
        autoComplete="new-password"
        variant="filled"
      ></TextField>

      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmpassword"
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        id="confirmpassword"
        error={formState.passwordConfirm.error}
        helperText={formState.passwordConfirm.helpertext}
        onChange={() => {
          changeHandler('passwordConfirm');
        }}
        autoComplete="new-password"
        variant="filled"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </EnterForm>
  );
};

export default Signup;
