import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID', // Get from EmailJS dashboard
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Get from EmailJS dashboard
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Get from EmailJS dashboard
};

// Twilio Configuration (via backend)
const TWILIO_CONFIG = {
  PHONE_TO_NOTIFY: '+17607802603', // Your phone number
  ADMIN_EMAIL: 'smimtiaj@gmail.com', // Your email
};

// Format order data for email
const formatOrderForEmail = (orderData) => {
  return {
    orderId: orderData.orderId,
    customerName: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
    customerEmail: orderData.customer.email,
    customerPhone: orderData.customer.phone,
    deliveryDate: orderData.customer.deliveryDate,
    deliveryTime: orderData.customer.deliveryTime,
    deliveryAddress: `${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.state} ${orderData.customer.zipCode}`,
    items: orderData.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price.toFixed(2),
      total: (item.price * item.quantity).toFixed(2),
    })),
    subtotal: orderData.subtotal.toFixed(2),
    deliveryFee: orderData.deliveryFee.toFixed(2),
    serviceCharge: orderData.serviceCharge.toFixed(2),
    tax: orderData.tax.toFixed(2),
    total: orderData.total.toFixed(2),
    paymentMethod: orderData.paymentMethod === 'credit_card' ? 'Credit Card' :
                  orderData.paymentMethod === 'paypal' ? 'PayPal' :
                  orderData.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery',
    specialInstructions: orderData.customer.specialInstructions || 'None',
    orderTime: new Date(orderData.orderDate).toLocaleString(),
  };
};

// Format SMS message
const formatOrderForSMS = (orderData) => {
  const customerName = `${orderData.customer.firstName} ${orderData.customer.lastName}`;
  const total = orderData.total.toFixed(2);
  const deliveryTime = orderData.customer.deliveryTime;
  
  return `📦 M Kitchen New Order!\nOrder: ${orderData.orderId}\nCustomer: ${customerName}\nTotal: $${total}\nDelivery: ${deliveryTime}\nPhone: ${orderData.customer.phone}\n---\nCheck email for full details.`;
};

// Send email using EmailJS
export const sendOrderEmail = async (orderData) => {
  try {
    const emailData = formatOrderForEmail(orderData);
    
    const templateParams = {
      to_email: TWILIO_CONFIG.ADMIN_EMAIL,
      to_name: 'M Kitchen Admin',
      from_name: 'M Kitchen Order System',
      reply_to: orderData.customer.email,
      ...emailData,
    };

    // Format items as HTML list for email
    templateParams.items_html = orderData.items.map(item => 
      `<li>${item.quantity} × ${item.name} - $${item.price.toFixed(2)} each = $${(item.price * item.quantity).toFixed(2)}</li>`
    ).join('');

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Email sent successfully:', response);
    return { success: true, emailId: response.text };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

// Send SMS via backend API (Twilio)
export const sendOrderSMS = async (orderData) => {
  try {
    const smsMessage = formatOrderForSMS(orderData);
    
    // In production, this would call your backend which calls Twilio
    // For now, we'll log it and send via backend API
    console.log('SMS to be sent:', smsMessage);
    
    // Call backend API to send SMS
    const response = await fetch('http://localhost:5000/api/notifications/sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: TWILIO_CONFIG.PHONE_TO_NOTIFY,
        message: smsMessage,
        orderId: orderData.orderId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send SMS');
    }

    const result = await response.json();
    console.log('SMS sent successfully:', result);
    return { success: true, smsId: result.sid };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return { success: false, error: error.message };
  }
};

// Send both email and SMS
export const sendOrderNotifications = async (orderData) => {
  console.log('Sending notifications for order:', orderData.orderId);
  
  const results = {
    email: { success: false },
    sms: { success: false },
  };

  try {
    // Send email
    results.email = await sendOrderEmail(orderData);
    
    // Send SMS
    results.sms = await sendOrderSMS(orderData);
    
    return results;
  } catch (error) {
    console.error('Notification error:', error);
    return results;
  }
};

export default {
  sendOrderEmail,
  sendOrderSMS,
  sendOrderNotifications,
};