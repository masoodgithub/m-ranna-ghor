const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu item name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: true,
        enum: ['appetizer', 'main', 'dessert', 'beverage', 'combo']
    },
    cuisine: {
        type: String,
        required: true,
        enum: ['chinese', 'indian', 'thai', 'japanese', 'korean', 'vietnamese', 'fusion', 'asian']
    },
    serves: {
        type: Number,
        default: 1
    },
    dietary: [{
        type: String,
        enum: ['vegetarian', 'vegan', 'gluten-free', 'halal', 'spicy', 'dairy-free']
    }],
    imageUrl: {
        type: String,
        default: ''
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number, // in minutes
        default: 30
    }
}, {
    timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;