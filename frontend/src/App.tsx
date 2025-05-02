import React, { useMemo, useContext } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { Box } from '@mui/material';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { mode } = useContext(ThemeContext);
  
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
        typography: {
          h4: {
            fontSize: '2.5rem',
            fontWeight: 600,
          },
          h5: {
            fontSize: '2rem',
            fontWeight: 500,
          },
          h6: {
            fontSize: '1.5rem',
            fontWeight: 500,
          },
          body1: {
            fontSize: '1.1rem',
          },
          body2: {
            fontSize: '1rem',
          },
          button: {
            fontSize: '1.1rem',
            textTransform: 'none',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                padding: '12px 24px',
                borderRadius: '8px',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiInputBase-root': {
                  fontSize: '1.1rem',
                  padding: '4px 0',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1.1rem',
                },
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                fontSize: '1.1rem',
                padding: '16px',
              },
              head: {
                fontSize: '1.1rem',
                fontWeight: 'bold',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontSize: '1rem',
                height: '32px',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </MuiThemeProvider>
  );
}

export default App;