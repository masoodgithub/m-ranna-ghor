const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// GET all menu items
router.get('/', async (req, res) => {
    try {
        const { category, cuisine, dietary, featured } = req.query;
        
        let filter = {};
        if (category) filter.category = category;
        if (cuisine) filter.cuisine = cuisine;
        if (dietary) filter.dietary = dietary;
        if (featured) filter.isFeatured = featured === 'true';
        
        const menuItems = await MenuItem.find(filter).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// GET single menu item
router.get('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        res.json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// POST create new menu item
router.post('/', async (req, res) => {
    try {
        const menuItem = new MenuItem(req.body);
        await menuItem.save();
        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: menuItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create menu item',
            error: error.message
        });
    }
});

// PUT update menu item
router.put('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        res.json({
            success: true,
            message: 'Menu item updated successfully',
            data: menuItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update menu item',
            error: error.message
        });
    }
});

// DELETE menu item
router.delete('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// GET menu categories
router.get('/categories/all', async (req, res) => {
    try {
        const categories = await MenuItem.distinct('category');
        const cuisines = await MenuItem.distinct('cuisine');
        const dietaryOptions = await MenuItem.distinct('dietary');
        
        res.json({
            success: true,
            data: {
                categories,
                cuisines,
                dietaryOptions: dietaryOptions.flat().filter(Boolean)
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