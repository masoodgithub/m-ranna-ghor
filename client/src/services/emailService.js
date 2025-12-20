import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_1gcmein',
  TEMPLATE_ID: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_mkau86h',
  PUBLIC_KEY: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'ZPmiHP5Fh9hkZgEUj',
};

console.log('📧 EmailJS Config:', {
  serviceId: EMAILJS_CONFIG.SERVICE_ID,
  templateId: EMAILJS_CONFIG.TEMPLATE_ID,
  publicKey: EMAILJS_CONFIG.PUBLIC_KEY?.slice(0, 10) + '...',
});

export const sendOrderEmail = async (orderData) => {
  try {
    console.log('🚀 Starting email send process...');
    console.log('Order data:', {
      orderId: orderData.orderId,
      customer: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
      email: orderData.customer.email,
    });

    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    const emailParams = {
      to_email: process.env.REACT_APP_ADMIN_EMAIL || 'smimtiaj@gmail.com',
      to_name: 'M Kitchen Admin',
      from_name: 'M Kitchen Order System',
      reply_to: orderData.customer.email,
      order_id: orderData.orderId,
      customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
      customer_email: orderData.customer.email,
      customer_phone: orderData.customer.phone,
      delivery_date: orderData.customer.deliveryDate,
      delivery_time: orderData.customer.deliveryTime,
      delivery_address: `${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.state} ${orderData.customer.zipCode}`,
      subtotal: orderData.subtotal?.toFixed(2) || '0.00',
      delivery_fee: orderData.deliveryFee?.toFixed(2) || '25.00',
      service_charge: orderData.serviceCharge?.toFixed(2) || '0.00',
      tax: orderData.tax?.toFixed(2) || '0.00',
      total: orderData.total?.toFixed(2) || '0.00',
      payment_method: orderData.paymentMethod === 'credit_card' ? 'Credit Card' :
                     orderData.paymentMethod === 'paypal' ? 'PayPal' :
                     orderData.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery',
      special_instructions: orderData.customer.specialInstructions || 'None',
      order_time: new Date().toLocaleString(),
    };

    // Format items as HTML list
    if (orderData.items && Array.isArray(orderData.items)) {
      emailParams.items = orderData.items.map(item => 
        `<li>${item.quantity || 1} × ${item.name || 'Item'} - $${(item.price || 0).toFixed(2)} each = $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</li>`
      ).join('');
    } else {
      emailParams.items = '<li>No items details available</li>';
    }

    console.log('📨 Sending email with params:', emailParams);

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      emailParams
    );

    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('Response:', response);
    console.log('Check smimtiaj@gmail.com for the email!');
    
    return { 
      success: true, 
      message: 'Email sent successfully',
      emailId: response.text 
    };

  } catch (error) {
    console.error('❌ EMAIL SENDING FAILED:', error);
    console.error('Error details:', {
      message: error.text || error.message,
      code: error.status,
    });
    
    return { 
      success: false, 
      error: error.text || error.message,
      details: error 
    };
  }
};

// Test function
export const sendTestEmail = async () => {
  const testOrder = {
    orderId: 'TEST-' + Date.now(),
    customer: {
      firstName: 'Test',
      lastName: 'Customer',
      email: 'test@example.com',
      phone: '+17607802603',
      address: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345',
      deliveryDate: '2024-12-25',
      deliveryTime: '18:00',
      specialInstructions: 'This is a test order',
    },
    items: [
      { name: 'Peking Duck', price: 299, quantity: 2 },
      { name: 'Spring Rolls', price: 89, quantity: 3 },
    ],
    subtotal: 299 * 2 + 89 * 3,
    deliveryFee: 25,
    serviceCharge: 0,
    tax: 50,
    total: 299 * 2 + 89 * 3 + 25 + 50,
    paymentMethod: 'credit_card',
  };

  return await sendOrderEmail(testOrder);
};

export default { sendOrderEmail, sendTestEmail };
