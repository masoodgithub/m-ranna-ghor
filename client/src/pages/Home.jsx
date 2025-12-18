import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CelebrationIcon from '@mui/icons-material/Celebration';
import GroupsIcon from '@mui/icons-material/Groups';

const Home = () => {
  const features = [
    {
      icon: <LocalDiningIcon sx={{ fontSize: 50, color: '#8B0000' }} />,
      title: 'Authentic Asian Cuisine',
      description: 'Traditional recipes passed down through generations',
    },
    {
      icon: <CelebrationIcon sx={{ fontSize: 50, color: '#8B0000' }} />,
      title: 'Perfect for Any Event',
      description: 'Weddings, corporate events, birthdays, and more',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 50, color: '#8B0000' }} />,
      title: 'Serves 10-1000+ Guests',
      description: 'Scalable solutions for any party size',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 15,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Taste the Authentic Flavors of Asia
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4 }}>
            Premium catering services bringing traditional Asian cuisine to your special occasions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/menu"
              sx={{
                backgroundColor: '#FFD700',
                color: '#8B0000',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                '&:hover': { backgroundColor: '#B8860B' },
              }}
            >
              View Our Menu
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/contact"
              sx={{
                borderColor: '#FFD700',
                color: '#FFD700',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                '&:hover': { borderColor: '#B8860B', color: '#B8860B' },
              }}
            >
              Get a Quote
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ color: '#8B0000' }}>
          Why Choose M Kitchen?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-10px)' },
                }}
              >
                {feature.icon}
                <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 2, color: '#5D0000' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Menu Preview */}
      <Box sx={{ backgroundColor: '#FFF8F0', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ color: '#8B0000' }}>
            Our Signature Dishes
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {[
              {
                title: 'Peking Duck',
                description: 'Crispy roasted duck with pancakes',
                image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                price: '$299',
              },
              {
                title: 'Butter Chicken',
                description: 'Creamy tomato curry with tender chicken',
                image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                price: '$199',
              },
              {
                title: 'Sushi Platter',
                description: 'Assorted fresh sushi and sashimi',
                image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                price: '$249',
              },
            ].map((dish, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={dish.image}
                    alt={dish.title}
                  />
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#8B0000' }}>
                      {dish.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {dish.description}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#5D0000', fontWeight: 'bold' }}>
                      {dish.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              component={Link}
              to="/menu"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: '#8B0000',
                '&:hover': { backgroundColor: '#5D0000' },
                px: 4,
                py: 1.5,
              }}
            >
              View Full Menu
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;