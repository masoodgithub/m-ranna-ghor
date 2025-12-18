const express = require('express');
const router = express.Router();
const ContactInquiry = require('../models/ContactInquiry');

// POST submit contact form
router.post('/', async (req, res) => {
    try {
        const inquiry = new ContactInquiry(req.body);
        await inquiry.save();
        
        // Here you would typically send an email notification
        console.log(`New inquiry from ${inquiry.name} for ${inquiry.eventType} event`);
        
        res.status(201).json({
            success: true,
            message: 'Thank you for your inquiry! We will contact you soon.',
            data: inquiry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to submit inquiry',
            error: error.message
        });
    }
});

// GET all inquiries (admin only - we'll add auth later)
router.get('/', async (req, res) => {
    try {
        const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: inquiries.length,
            data: inquiries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// UPDATE inquiry status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, notes } = req.body;
        const inquiry = await ContactInquiry.findByIdAndUpdate(
            req.params.id,
            { status, ...(notes && { notes }) },
            { new: true, runValidators: true }
        );
        
        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Inquiry status updated',
            data: inquiry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update inquiry',
            error: error.message
        });
    }
});

// GET inquiry statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const total = await ContactInquiry.countDocuments();
        const byStatus = await ContactInquiry.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const byEventType = await ContactInquiry.aggregate([
            { $group: { _id: '$eventType', count: { $sum: 1 } } }
        ]);
        
        res.json({
            success: true,
            data: {
                total,
                byStatus,
                byEventType
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;