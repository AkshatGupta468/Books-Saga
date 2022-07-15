import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { CircularProgress, Link } from '@mui/material';
import { forgorPasswordRequest } from '../utils/apicomm';
import { Copyright } from './copyright';
import { theme } from '../utils/theme';
import { ThemeProvider } from '@emotion/react';
import EnterForm from './enterform';
const defaultFormState = {
  email: {
    error: false,
    helpertext: '',
  },
};
const Forgotpassword = () => {
  const [formState, setFormState] = React.useState(defaultFormState);
  const [isLoading, setIsLoading] = React.useState(false);
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
    setIsLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      email: data.get('email'),
    };
    forgorPasswordRequest(body)
      .then((data) => {
        setIsLoading(false);
        setFormState((oldState) => {
          const newState = {
            ...oldState,
          };
          newState['email'].helpertext = 'Reset Link Sent to Your Email';
          return newState;
        });
      })
      .catch((errors) => {
        setIsLoading(false);
        console.log('errorsfromforgotpass', errors);
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
      pagename={'Forgot Password?'}
      buttonname={'Get Reset Link'}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      footlinks={
        <Grid container>
          <Grid item>
            <Link variant="body2" component={RouterLink} to="/sign-up">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
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
    </EnterForm>
  );
};

export default Forgotpassword;
