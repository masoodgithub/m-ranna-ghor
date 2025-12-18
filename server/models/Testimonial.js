const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    eventType: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    imageUrl: {
        type: String
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;