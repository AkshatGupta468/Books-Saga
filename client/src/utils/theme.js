const { createTheme } = require('@mui/material');

export const theme = createTheme({
  palette: {
    primary: {
      main: '#A0AF00',
      light: '#F0FBFC',
      dark: '#F36234',
      contrastText: '#000020',
    },
    secondary: {
      main: '#EAEF55',
      light: '#EADFEE',
      dark: '#292593',
    },
    background: {
      paper: '#F9FFF0',
      default: '#fff',
    },
  },
  typography: {
    bookname: {
      fontFamily: '"Ubuntu","Cursive","Roboto","Helvetica"',
      fontWeight: 500,
    },
  },
});
