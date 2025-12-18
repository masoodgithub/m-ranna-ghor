import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
      <List>
        {navItems.map((item) => (
          <Typography
  variant="h6"
  component={Link}
  to="/"
  sx={{
    textDecoration: 'none',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'cursive',
  }}
>
  M Kitchen
</Typography>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#8B0000' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo/Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RestaurantMenuIcon sx={{ fontSize: 30, color: '#FFD700' }} />
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'cursive',
                }}
              >
                M Kitchen
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: 'white',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    borderBottom: location.pathname === item.path ? '2px solid #FFD700' : 'none',
                    borderRadius: 0,
                  }}
                >
                  {item.name}
                </Button>
              ))}
              <Button
                variant="contained"
                component={Link}
                to="/contact"
                sx={{
                  backgroundColor: '#FFD700',
                  color: '#8B0000',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#B8860B' },
                }}
              >
                Order Now
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { md: 'none' } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;