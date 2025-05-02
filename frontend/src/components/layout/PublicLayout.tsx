// frontend/src/components/layout/PublicLayout.tsx

import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '../../context/ThemeContext';

const PublicLayout: React.FC = () => {
  const { mode, toggleMode } = useContext(ThemeContext);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ py: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5">School Payment System</Typography>
          
          {/* Dark mode toggle inside AppBar */}
          <IconButton 
            onClick={toggleMode}
            color="inherit" 
            aria-label="toggle dark mode"
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Toolbar /> {/* This adds spacing below the fixed AppBar */}
      
      <Container component="main" sx={{ mt: 6, mb: 6, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            width: '100%', 
            maxWidth: 600, 
            mx: 'auto',
            borderRadius: 2
          }}
        >
          <Outlet />
        </Paper>
      </Container>
      
      <Box component="footer" sx={{ py: 4, bgcolor: 'background.paper', textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          © {new Date().getFullYear()} School Payment System
        </Typography>
      </Box>
    </Box>
  );
};

export default PublicLayout;