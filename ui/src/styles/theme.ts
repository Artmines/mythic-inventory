import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#000000',
      light: '#0FC6A6',
      dark: '#034238',
    },
    secondary: {
      main: '#141414',
      dark: '#0c0c0c',
    },
    success: {
      main: '#9CE60D',
    },
    error: {
      main: '#6e1616',
    },
    warning: {
      main: '#f09348',
    },
    info: {
      main: '#247ba5',
    },
    background: {
      default: import.meta.env.MODE === 'production' ? 'transparent' : '#0c1826',
      paper: 'rgba(12, 24, 38, 0.733)',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: import.meta.env.MODE === 'production' ? 'transparent' : undefined,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#247ba59e',
            transition: 'background ease-in 0.15s',
            borderRadius: '0.375rem',
            '&:hover': {
              background: '#247ba5',
            },
          },
        },
      },
    },
  },
});

export const rarityColors = {
  1: '#ffffff',
  2: '#9CE60D',
  3: '#247ba5',
  4: '#8e3bb8',
  5: '#f2d411',
} as const;
