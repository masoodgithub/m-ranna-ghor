const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
    res.json({ message: 'M Ranna Ghor Catering API' });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        service: 'M Ranna Ghor Backend',
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