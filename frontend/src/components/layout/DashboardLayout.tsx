// src/components/layout/DashboardLayout.tsx
import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  AppBar, Box, Toolbar, Typography, Button, Container, 
  Drawer, List, ListItemIcon, ListItemText, Divider, 
  ListItemButton
} from '@mui/material';
import { Dashboard as DashboardIcon, PaymentRounded, ListAlt, Logout } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            School Payment System
          </Typography>
          
          {user && (
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ mr: 2 }}>
                Welcome, {user.username}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItemButton onClick={() => navigate('/dashboard')}>
              <ListItemIcon>
                <DashboardIcon sx={{ fontSize: 28 }} />
              </ListItemIcon>
              <ListItemText 
              primary="Dashboard"
              primaryTypographyProps={{ fontSize: '1.2rem' }}
              />
            </ListItemButton>
            
            <ListItemButton onClick={() => navigate('/dashboard/create-payment')}>
              <ListItemIcon>
                <PaymentRounded />
              </ListItemIcon>
              <ListItemText primary="Create Payment" />
            </ListItemButton>

            <ListItemButton onClick={() => navigate('/dashboard/school-transactions')}>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
              <ListItemText primary="School Transactions" />
            </ListItemButton>
            
            <ListItemButton onClick={() => navigate('/dashboard/transactions')}>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
              <ListItemText primary="Check Transaction Status" />
            </ListItemButton>
          </List>
          
          <Divider />
          
          <List>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;