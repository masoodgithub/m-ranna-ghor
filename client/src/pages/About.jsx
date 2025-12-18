import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const About = () => {
  const teamMembers = [
    {
      name: 'Chef Li Wei',
      role: 'Head Chef - Chinese Cuisine',
      experience: '15+ years',
      specialty: 'Peking Duck, Dim Sum',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Chef Priya Sharma',
      role: 'Indian Cuisine Specialist',
      experience: '12+ years',
      specialty: 'Butter Chicken, Biryani',
      image: 'https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Chef Takeshi Yamamoto',
      role: 'Japanese Cuisine Expert',
      experience: '10+ years',
      specialty: 'Sushi, Teppanyaki',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  ];

  const values = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 40, color: '#8B0000' }} />,
      title: 'Authenticity',
      description: 'Traditional recipes, authentic ingredients',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40, color: '#8B0000' }} />,
      title: 'Community',
      description: 'Serving our community with pride',
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#8B0000' }} />,
      title: 'Excellence',
      description: 'Consistent quality in every dish',
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: '#8B0000' }} />,
      title: 'Reliability',
      description: 'On-time delivery, every time',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#8B0000' }}>
          Our Story
        </Typography>
        <Typography variant="h5" sx={{ color: '#5D0000', maxWidth: '800px', mx: 'auto' }}>
          Bringing authentic Asian flavors to your special moments since 2010
        </Typography>
      </Box>

      {/* Story Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 6, backgroundColor: '#FFF8F0' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ color: '#8B0000' }}>
              From Humble Beginnings
            </Typography>
            <Typography paragraph>
              M Kitchen began as a small family kitchen in 2010, founded by Master Chef 
              Mohammad Rahman. With a passion for authentic Asian cuisine and a vision to 
              share these flavors with the community, what started as a home-based catering 
              service has grown into one of the region's most trusted catering companies.
            </Typography>
            <Typography paragraph>
              The name "Ranna Ghor" translates to "Kitchen House" in Bengali, representing 
              our commitment to creating food that feels like home - warm, comforting, and 
              made with love.
            </Typography>
            <Typography>
              Today, we serve hundreds of satisfied customers each year, from intimate 
              family gatherings to large corporate events and grand weddings.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Our Kitchen"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Our Values */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ color: '#8B0000', mb: 4 }}>
          Our Values
        </Typography>
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ mb: 2 }}>{value.icon}</Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#5D0000' }}>
                  {value.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Our Team */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ color: '#8B0000', mb: 4 }}>
          Meet Our Culinary Team
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <Avatar
                  src={member.image}
                  alt={member.name}
                  sx={{
                    width: 150,
                    height: 150,
                    mx: 'auto',
                    mt: 3,
                    border: '4px solid #FFD700',
                  }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#8B0000' }}>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Experience:</strong> {member.experience}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Specialty:</strong> {member.specialty}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Why Choose Us */}
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#8B0000', color: 'white' }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ color: '#FFD700', mb: 4 }}>
          Why Choose M Kitchen?
        </Typography>
        <Grid container spacing={3}>
          {[
            '100+ successful events catered annually',
            'Fresh ingredients sourced daily',
            'Customizable menus for every budget',
            'Professional staff and setup',
            'Hygiene and safety certified',
            'Flexible vegetarian/vegan options',
          ].map((point, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#FFD700',
                    borderRadius: '50%',
                  }}
                />
                <Typography>{point}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default About;