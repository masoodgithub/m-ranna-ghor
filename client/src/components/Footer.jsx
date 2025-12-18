import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#2C1810',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FFD700' }}>
  M Kitchen
</Typography>
           <Typography variant="body2" paragraph>
  Premium Asian catering services for all occasions. 
  Bringing authentic Asian flavors to your events with passion and perfection.
</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton sx={{ color: '#FFD700' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: '#FFD700' }}>
                <InstagramIcon />
              </IconButton>
              <IconButton sx={{ color: '#FFD700' }}>
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FFD700' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                Home
              </Link>
              <Link to="/menu" style={{ color: 'white', textDecoration: 'none' }}>
                Menu
              </Link>
              <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>
                About Us
              </Link>
              <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FFD700' }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#FFD700' }} />
                <Typography>+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#FFD700' }} />
                <Typography>info@mrannaghor.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon sx={{ color: '#FFD700', mt: 0.5 }} />
                <Typography>
                  123 Food Street, Culinary District
                  <br />
                  Metro City, MC 10001
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: '#FFD700' }} />

        {/* Copyright */}
        <Typography variant="body2" align="center" sx={{ color: '#FFD700' }}>
  © {currentYear} M Kitchen Catering. All rights reserved.
  <br />
  Crafted with ❤️ for food lovers
</Typography>
      </Container>
    </Box>
  );
};

export default Footer;