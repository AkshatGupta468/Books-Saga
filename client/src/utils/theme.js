const { createTheme } = require('@mui/material');

export const theme = createTheme({
  palette: {
    primary: {
      main: '#A0AF00',
      light: '#F36234',
      contrastText: '#000020',
    },
    secondary: {
      main: '#EAEF55',
      light: '#EADFEE',
    },
  },
});
