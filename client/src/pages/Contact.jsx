import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    guestCount: '',
    eventType: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const eventTypes = [
    'Wedding',
    'Corporate Event',
    'Birthday Party',
    'Anniversary',
    'Family Gathering',
    'Other',
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.guestCount) newErrors.guestCount = 'Guest count is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  try {
    // REAL API CALL
    const response = await axios.post('http://localhost:5000/api/contact', formData);
    
    if (response.data.success) {
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        guestCount: '',
        eventType: '',
        message: '',
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }
    
  } catch (error) {
    console.error('Error submitting form:', error);
    setSubmitStatus('error');
  }
};

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ color: '#8B0000', mb: 4 }}>
        Get In Touch
      </Typography>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#5D0000' }}>
              Request a Quote
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Fill out the form below and we'll get back to you within 24 hours.
            </Typography>

            {submitStatus === 'success' && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you for your inquiry! We will contact you soon.
              </Alert>
            )}

            {submitStatus === 'error' && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Something went wrong. Please try again or contact us directly.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Event Date"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.eventDate}
                    helperText={errors.eventDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Number of Guests"
                    name="guestCount"
                    type="number"
                    value={formData.guestCount}
                    onChange={handleChange}
                    InputProps={{ inputProps: { min: 1 } }}
                    error={!!errors.guestCount}
                    helperText={errors.guestCount}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.eventType}>
                    <InputLabel>Event Type</InputLabel>
                    <Select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      label="Event Type"
                    >
                      {eventTypes.map((type) => (
                        <MenuItem key={type} value={type.toLowerCase()}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.eventType && (
                      <Typography variant="caption" color="error">
                        {errors.eventType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Additional Information"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your event, dietary requirements, or any special requests..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{
                      backgroundColor: '#8B0000',
                      '&:hover': { backgroundColor: '#5D0000' },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Submit Request
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <PhoneIcon sx={{ color: '#8B0000', fontSize: 30 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: '#5D0000' }}>
                    Call Us
                  </Typography>
                  <Typography variant="body1">+1 (555) 123-4567</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Available 9 AM - 9 PM, 7 days a week
              </Typography>
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <EmailIcon sx={{ color: '#8B0000', fontSize: 30 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: '#5D0000' }}>
                    Email Us
                  </Typography>
                  <Typography variant="body1">info@mrannaghor.com</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                We respond within 24 hours
              </Typography>
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <LocationOnIcon sx={{ color: '#8B0000', fontSize: 30, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: '#5D0000' }}>
                    Visit Us
                  </Typography>
                  <Typography variant="body1">
                    123 Food Street
                    <br />
                    Culinary District
                    <br />
                    Metro City, MC 10001
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                By appointment only
              </Typography>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#FFF8F0' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#8B0000' }}>
                What Happens Next?
              </Typography>
              <ol style={{ paddingLeft: '20px' }}>
                <li>Submit your inquiry</li>
                <li>We'll contact you within 24 hours</li>
                <li>Custom menu planning session</li>
                <li>Receive detailed quote</li>
                <li>Confirm booking & details</li>
              </ol>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;