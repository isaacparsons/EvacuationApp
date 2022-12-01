import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4ba39f'
    },
    secondary: {
      main: '#e8e8e8',
      dark: '#949494'
    }
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Segoe UI, Arial, sans-serif'
  }
});

export default theme;
