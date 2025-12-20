import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PayPalIcon from '@mui/icons-material/Payment';
import { sendOrderEmail } from '../services/emailService';

const steps = ['Shipping Information', 'Payment Method', 'Review & Confirm'];

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationResults, setNotificationResults] = useState({ email: null, sms: null });
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryDate: '',
    deliveryTime: '',
    specialInstructions: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Email is invalid';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!shippingInfo.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
    if (!shippingInfo.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateForm()) {
      return;
    }
    
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value,
    });
  };

  const sendSMSNotification = async (orderData) => {
    try {
      console.log('📱 Attempting to send SMS...');
      
      const response = await fetch('http://localhost:5000/api/notifications/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+17607802603',
          orderData: orderData,
        }),
      });

      const result = await response.json();
      console.log('SMS API response:', result);
      
      return {
        success: result.success,
        message: result.message,
        sid: result.sid,
        error: result.error,
      };
      
    } catch (error) {
      console.error('SMS fetch error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to connect to SMS service',
      };
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setNotificationResults({ email: null, sms: null });

    try {
      // Calculate final total
      const deliveryFee = 25;
      const serviceCharge = cartTotal * 0.1;
      const tax = cartTotal * 0.085;
      const finalTotal = cartTotal + deliveryFee + serviceCharge + tax;

      // Create order object
      const orderData = {
        orderId: `MK-${Date.now()}`,
        customer: shippingInfo,
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          cuisine: item.cuisine,
          dietary: item.dietary,
        })),
        paymentMethod,
        subtotal: cartTotal,
        deliveryFee,
        serviceCharge,
        tax,
        total: finalTotal,
        status: 'pending',
        orderDate: new Date().toISOString(),
      };

      console.log('📦 Order created:', orderData);

      // Generate final order ID
      const generatedOrderId = `MK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setOrderId(generatedOrderId);

      // 1. SEND EMAIL NOTIFICATION
      console.log('📧 Starting email notification...');
      const emailResult = await sendOrderEmail({
        ...orderData,
        orderId: generatedOrderId,
      });
      
      setNotificationResults(prev => ({ ...prev, email: emailResult }));
      console.log('Email result:', emailResult);

      // 2. SEND SMS NOTIFICATION
      console.log('📱 Starting SMS notification...');
      const smsResult = await sendSMSNotification({
        ...orderData,
        orderId: generatedOrderId,
      });
      
      setNotificationResults(prev => ({ ...prev, sms: smsResult }));
      console.log('SMS result:', smsResult);

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('mkitchen_orders') || '[]');
      localStorage.setItem('mkitchen_orders', JSON.stringify([...existingOrders, {
        ...orderData,
        orderId: generatedOrderId,
        emailNotification: emailResult,
        smsNotification: smsResult,
        savedAt: new Date().toISOString(),
      }]));

      // Clear cart
      clearCart();

      // Show success summary
      let summary = `🎉 ORDER #${generatedOrderId} PLACED SUCCESSFULLY!\n\n`;
      summary += `Customer: ${shippingInfo.firstName} ${shippingInfo.lastName}\n`;
      summary += `Total: $${finalTotal.toFixed(2)}\n`;
      summary += `Delivery: ${shippingInfo.deliveryDate} at ${shippingInfo.deliveryTime}\n\n`;
      
      summary += `📧 EMAIL STATUS: ${emailResult.success ? '✅ SENT to smimtiaj@gmail.com' : '❌ FAILED: ' + emailResult.error}\n`;
      summary += `📱 SMS STATUS: ${smsResult.success ? '✅ SENT to 760-780-2603' : '❌ FAILED: ' + smsResult.error}\n\n`;
      
      summary += `Check your email and phone for notifications.`;
      
      alert(summary);
      setOrderSuccess(true);

      // Redirect to confirmation page
      setTimeout(() => {
        navigate(`/order-confirmation/${generatedOrderId}`);
      }, 3000);

    } catch (error) {
      console.error('❌ Order placement error:', error);
      alert(`Order placement failed: ${error.message}\n\nCheck browser console for details.`);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={shippingInfo.firstName}
                  onChange={handleShippingChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={shippingInfo.lastName}
                  onChange={handleShippingChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={handleShippingChange}
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
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  placeholder="+17607802603"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Delivery Address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.state}>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    label="State"
                  >
                    <MenuItem value=""><em>Select State</em></MenuItem>
                    <MenuItem value="CA">California</MenuItem>
                    <MenuItem value="NY">New York</MenuItem>
                    <MenuItem value="TX">Texas</MenuItem>
                    <MenuItem value="FL">Florida</MenuItem>
                    <MenuItem value="IL">Illinois</MenuItem>
                    <MenuItem value="WA">Washington</MenuItem>
                    <MenuItem value="MA">Massachusetts</MenuItem>
                  </Select>
                  {errors.state && (
                    <Typography variant="caption" color="error">
                      {errors.state}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="ZIP Code"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleShippingChange}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Delivery Date"
                  name="deliveryDate"
                  type="date"
                  value={shippingInfo.deliveryDate}
                  onChange={handleShippingChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.deliveryDate}
                  helperText={errors.deliveryDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.deliveryTime}>
                  <InputLabel>Delivery Time</InputLabel>
                  <Select
                    name="deliveryTime"
                    value={shippingInfo.deliveryTime}
                    onChange={handleShippingChange}
                    label="Delivery Time"
                  >
                    <MenuItem value=""><em>Select Time</em></MenuItem>
                    <MenuItem value="11:00">11:00 AM</MenuItem>
                    <MenuItem value="12:00">12:00 PM</MenuItem>
                    <MenuItem value="13:00">1:00 PM</MenuItem>
                    <MenuItem value="14:00">2:00 PM</MenuItem>
                    <MenuItem value="18:00">6:00 PM</MenuItem>
                    <MenuItem value="19:00">7:00 PM</MenuItem>
                  </Select>
                  {errors.deliveryTime && (
                    <Typography variant="caption" color="error">
                      {errors.deliveryTime}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Special Instructions"
                  name="specialInstructions"
                  value={shippingInfo.specialInstructions}
                  onChange={handleShippingChange}
                  placeholder="Delivery instructions, dietary restrictions, etc."
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="credit_card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCardIcon />
                      <Typography>Credit/Debit Card</Typography>
                    </Box>
                  }
                />
                
                {paymentMethod === 'credit_card' && (
                  <Box sx={{ ml: 4, mt: 2, p: 2, backgroundColor: '#FFF8F0', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Card Number"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Name on Card"
                          name="cardName"
                          value={paymentInfo.cardName}
                          onChange={handlePaymentChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Expiry Date"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="CVV"
                          name="cvv"
                          type="password"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PayPalIcon />
                      <Typography>PayPal</Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  value="bank_transfer"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalanceIcon />
                      <Typography>Bank Transfer</Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  value="cash_on_delivery"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
              </RadioGroup>
            </FormControl>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> For bank transfers, payment details will be emailed.
                For cash on delivery, exact change is preferred.
              </Typography>
            </Alert>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#8B0000' }}>
              Order Review
            </Typography>
            
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#FFF8F0' }}>
              <Typography variant="subtitle1" gutterBottom>
                Order Summary
              </Typography>
              {cartItems.map((item) => (
                <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>
                    {item.quantity} × {item.name}
                  </Typography>
                  <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
              
              <Box sx={{ borderTop: '1px solid #ddd', pt: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>${cartTotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Delivery Fee</Typography>
                  <Typography>$25.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Service Charge (10%)</Typography>
                  <Typography>${(cartTotal * 0.1).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax (8.5%)</Typography>
                  <Typography>${(cartTotal * 0.085).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '2px solid #8B0000' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="#8B0000">
                    ${(cartTotal + 25 + (cartTotal * 0.1) + (cartTotal * 0.085)).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#8B0000' }}>
                Delivery Information
              </Typography>
              <Typography>
                {shippingInfo.firstName} {shippingInfo.lastName}
              </Typography>
              <Typography>{shippingInfo.address}</Typography>
              <Typography>
                {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
              </Typography>
              <Typography>Phone: {shippingInfo.phone}</Typography>
              <Typography>Email: {shippingInfo.email}</Typography>
              <Typography>
                Delivery: {shippingInfo.deliveryDate} at {shippingInfo.deliveryTime}
              </Typography>
              {shippingInfo.specialInstructions && (
                <Typography>
                  Instructions: {shippingInfo.specialInstructions}
                </Typography>
              )}
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#8B0000' }}>
                Payment Method
              </Typography>
              <Typography>
                {paymentMethod === 'credit_card' && 'Credit/Debit Card'}
                {paymentMethod === 'paypal' && 'PayPal'}
                {paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                {paymentMethod === 'cash_on_delivery' && 'Cash on Delivery'}
              </Typography>
            </Paper>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  if (orderSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6">
            🎉 Order #{orderId} placed successfully!
          </Typography>
        </Alert>
        
        <Box sx={{ textAlign: 'left', mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notification Status:
          </Typography>
          {notificationResults.email && (
            <Alert 
              severity={notificationResults.email.success ? "success" : "error"}
              sx={{ mb: 1 }}
            >
              Email: {notificationResults.email.success 
                ? '✅ Sent to smimtiaj@gmail.com' 
                : `❌ Failed: ${notificationResults.email.error}`}
            </Alert>
          )}
          {notificationResults.sms && (
            <Alert 
              severity={notificationResults.sms.success ? "success" : "error"}
              sx={{ mb: 1 }}
            >
              SMS: {notificationResults.sms.success 
                ? '✅ Sent to 760-780-2603' 
                : `❌ Failed: ${notificationResults.sms.error}`}
            </Alert>
          )}
        </Box>
        
        <Typography variant="body1" paragraph>
          Redirecting to order confirmation...
        </Typography>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#8B0000', mb: 4 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 4 }}>
        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            sx={{
              backgroundColor: '#8B0000',
              '&:hover': { backgroundColor: '#5D0000' },
              px: 4,
              minWidth: 120,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              'Place Order'
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout;