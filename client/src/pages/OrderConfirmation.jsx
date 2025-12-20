import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PrintIcon from '@mui/icons-material/Print';
import HomeIcon from '@mui/icons-material/Home';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ShareIcon from '@mui/icons-material/Share';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from backend API
    // For now, get from localStorage
    const orders = JSON.parse(localStorage.getItem('mkitchen_orders') || '[]');
    const foundOrder = orders.find(o => o.orderId === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
    }
    
    setLoading(false);
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `M Kitchen Order Confirmation - ${orderId}`,
        text: `Thank you for your order from M Kitchen! Order ID: ${orderId}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading order details...</Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Order not found. Please check your order ID.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            backgroundColor: '#8B0000',
            '&:hover': { backgroundColor: '#5D0000' },
          }}
        >
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Confirmation Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#8B0000' }}>
          Order Confirmed!
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Thank you for your order, {order.customer.firstName}!
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Order ID: <strong>{order.orderId}</strong>
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Order Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#8B0000' }}>
              Order Summary
            </Typography>
            <List>
              {order.items.map((item, index) => (
                <React.Fragment key={item._id}>
                  <ListItem>
                    <ListItemText
                      primary={`${item.quantity} × ${item.name}`}
                      secondary={`$${item.price} each`}
                    />
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </ListItem>
                  {index < order.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #ddd' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${order.subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Delivery Fee</Typography>
                <Typography>${order.deliveryFee.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Service Charge</Typography>
                <Typography>${order.serviceCharge.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax</Typography>
                <Typography>${order.tax.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '2px solid #8B0000' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="#8B0000">
                  ${order.total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#8B0000' }}>
              Delivery Information
            </Typography>
            <Typography gutterBottom>
              <strong>Delivery Date:</strong> {order.customer.deliveryDate}
            </Typography>
            <Typography gutterBottom>
              <strong>Delivery Time:</strong> {order.customer.deliveryTime}
            </Typography>
            <Typography gutterBottom>
              <strong>Address:</strong> {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zipCode}
            </Typography>
            {order.customer.specialInstructions && (
              <Typography>
                <strong>Special Instructions:</strong> {order.customer.specialInstructions}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Order Status & Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#8B0000' }}>
              Order Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: order.status === 'pending' ? '#FF9800' : '#4CAF50',
                }}
              />
              <Typography>
                {order.status === 'pending' ? 'Processing' : 'Confirmed'}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Order placed on {new Date(order.orderDate).toLocaleDateString()} at{' '}
              {new Date(order.orderDate).toLocaleTimeString()}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#8B0000' }}>
              Payment Details
            </Typography>
            <Typography gutterBottom>
              <strong>Method:</strong>{' '}
              {order.paymentMethod === 'credit_card' && 'Credit/Debit Card'}
              {order.paymentMethod === 'paypal' && 'PayPal'}
              {order.paymentMethod === 'bank_transfer' && 'Bank Transfer'}
              {order.paymentMethod === 'cash_on_delivery' && 'Cash on Delivery'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.paymentMethod === 'cash_on_delivery' &&
                'Please have exact change ready for delivery.'}
              {order.paymentMethod === 'bank_transfer' &&
                'Payment details will be sent to your email.'}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, backgroundColor: '#FFF8F0' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#8B0000' }}>
              Next Steps
            </Typography>
            <List dense>
              <ListItem>
                <EmailIcon sx={{ mr: 2, color: '#8B0000' }} />
                <ListItemText
                  primary="Confirmation Email"
                  secondary="Sent to your email within 5 minutes"
                />
              </ListItem>
              <ListItem>
                <PhoneIcon sx={{ mr: 2, color: '#8B0000' }} />
                <ListItemText
                  primary="Order Confirmation Call"
                  secondary="We'll call to confirm details within 24 hours"
                />
              </ListItem>
              <ListItem>
                <HomeIcon sx={{ mr: 2, color: '#8B0000' }} />
                <ListItemText
                  primary="Delivery"
                  secondary="Our team will arrive at the scheduled time"
                />
              </ListItem>
            </List>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<LocalPrintshopIcon />}
              onClick={handlePrint}
              sx={{
                backgroundColor: '#8B0000',
                '&:hover': { backgroundColor: '#5D0000' },
              }}
            >
              Print Receipt
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShare}
            >
              Share Order
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/menu')}
            >
              Order More
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Contact Support */}
      <Paper sx={{ p: 3, mt: 4, backgroundColor: '#FFF8F0' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#8B0000' }}>
          Need Help?
        </Typography>
        <Typography paragraph>
          For any questions about your order, contact our customer support:
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Phone
            </Typography>
            <Typography>+1 (555) 123-4567</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography>orders@mkitchen.com</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Hours
            </Typography>
            <Typography>Mon-Sun: 9 AM - 9 PM</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderConfirmation;