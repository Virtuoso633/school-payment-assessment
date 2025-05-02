import React, { useMemo, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999, // Increase z-index to ensure it's always on top
          backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(33,33,33,0.8)', // Semi-transparent background
          borderRadius: '50%', // Make it circular
          padding: '4px', // Add padding
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', // Add shadow for better visibility
        }}
      >
        <IconButton
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          color="inherit"
          aria-label="toggle dark mode"
          size="large" // Make it slightly larger
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );

}

export default App;