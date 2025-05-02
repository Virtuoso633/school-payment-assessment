// frontend/src/components/layout/PublicLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, AppBar, Toolbar, Typography } from '@mui/material';

const PublicLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ py: 1 }}>
        <Toolbar>
          <Typography variant="h5">School Payment System</Typography>
        </Toolbar>
      </AppBar>
      
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