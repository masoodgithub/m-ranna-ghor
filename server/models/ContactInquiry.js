const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    eventDate: {
        type: Date,
        required: [true, 'Event date is required']
    },
    guestCount: {
        type: Number,
        required: [true, 'Guest count is required'],
        min: [1, 'Must have at least 1 guest']
    },
    eventType: {
        type: String,
        enum: ['wedding', 'corporate', 'birthday', 'anniversary', 'family-gathering', 'other'],
        required: true
    },
    message: {
        type: String,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    menuPreferences: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['new', 'contacted', 'quoted', 'booked', 'cancelled'],
        default: 'new'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema);
module.exports = ContactInquiry;
