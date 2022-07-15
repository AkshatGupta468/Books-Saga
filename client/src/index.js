import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import App from './App';
import Forgotpassword from './components/forgotpassword';
import ResetPassword from './components/resetpassword';
import Signup from './components/signup';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './utils/theme';
import { Container } from '@mui/material';
import { Box } from '@mui/material';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Box sx={{ height: '100vh' }}>
          <Routes>
            <Route path="/log-in" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/forgot-password" element={<Forgotpassword />} />
            <Route
              path="/resetPassword/:resetToken"
              element={<ResetPassword />}
            />
            <Route path="" element={<App />} />
            <Route
              path="*"
              element={<App messageHeading="404" messagePara="NOT FOUND" />}
            />
          </Routes>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
