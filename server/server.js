const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Import Routes
const menuRoutes = require('./routes/menuRoutes');
const contactRoutes = require('./routes/contactRoutes');
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// After the imports, update CORS configuration:
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use Routes
app.use('/api/menu', menuRoutes);
app.use('/api/contact', contactRoutes);

// MongoDB Connection - UPDATED VERSION
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:BD8279%40mongo@catering-cluster.hvp3z4w.mongodb.net/m-ranna-ghor?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// Optional: Add event listeners
mongoose.connection.on('connected', () => {
    console.log('📊 MongoDB connected to database:', mongoose.connection.name);
});
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'M Kitchen Catering API' });
});
// Testimonial route (we'll create later)
app.get('/api/testimonials', (req, res) => {
    res.json({
        success: true,
        message: 'Testimonials endpoint - coming soon'
    });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        service: 'M Kitchen Backend',
        timestamp: new Date().toISOString()
    });
});

// Menu Route (We'll expand this later)
app.get('/api/menu', (req, res) => {
    res.json({
        message: 'Menu endpoint - will return catering menu'
    });
});

// Contact Route
app.post('/api/contact', (req, res) => {
    // Will implement later
    res.json({ message: 'Contact form submitted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}`);
});