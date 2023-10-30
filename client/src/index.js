import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import App from './App';
import Forgotpassword from './components/forgotpassword';
import ResetPassword from './components/resetpassword';
import Signup from './components/signup';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './utils/theme';
import { Box } from '@mui/material';
import { Welcome } from './components/welcome';
import { Buy } from './components/buy';
import AppRoutes from './routes';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider theme={theme}>
        <Box sx={{ height: '100vh' }}>
          <AppRoutes />
        </Box>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
