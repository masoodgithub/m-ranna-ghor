import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../contexts/CartContext';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  
  const { addToCart } = useCart();

  // Mock data - replace with API call
  useEffect(() => {
    const mockMenu = [
      {
        _id: '1',
        name: 'Peking Duck Platter',
        description: 'Crispy roasted duck served with thin pancakes, spring onions, and hoisin sauce',
        price: 299,
        category: 'main',
        cuisine: 'chinese',
        serves: 10,
        dietary: ['gluten-free'],
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        _id: '2',
        name: 'Butter Chicken Feast',
        description: 'Tender chicken in rich tomato and butter curry, served with naan and rice',
        price: 199,
        category: 'main',
        cuisine: 'indian',
        serves: 8,
        dietary: ['spicy'],
        imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        _id: '3',
        name: 'Sushi Deluxe Platter',
        description: 'Assorted sushi, sashimi, nigiri with wasabi and soy sauce',
        price: 249,
        category: 'main',
        cuisine: 'japanese',
        serves: 6,
        dietary: [],
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        _id: '4',
        name: 'Pad Thai Noodles',
        description: 'Stir-fried rice noodles with tofu, peanuts, and lime',
        price: 159,
        category: 'main',
        cuisine: 'thai',
        serves: 6,
        dietary: ['vegetarian'],
        imageUrl: 'https://images.unsplash.com/photo-1559314809-2b99056a8c4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        _id: '5',
        name: 'Vegetable Spring Rolls',
        description: 'Crispy rolls filled with fresh vegetables, served with sweet chili sauce',
        price: 89,
        category: 'appetizer',
        cuisine: 'chinese',
        serves: 6,
        dietary: ['vegetarian'],
        imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        _id: '6',
        name: 'Mango Sticky Rice',
        description: 'Sweet coconut sticky rice with fresh mango slices',
        price: 119,
        category: 'dessert',
        cuisine: 'thai',
        serves: 4,
        dietary: ['vegetarian'],
        imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
    ];

    setMenuItems(mockMenu);
    setFilteredItems(mockMenu);
    
    // Extract unique categories
    const uniqueCategories = ['all', ...new Set(mockMenu.map(item => item.category))];
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    let filtered = menuItems;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, searchTerm, menuItems]);

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  const handleQuantityChange = (itemId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta)
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    addToCart(item, quantity);
    
    // Show success message
    alert(`Added ${quantity} ${item.name} to cart!`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ color: '#8B0000', mb: 4 }}>
        M Kitchen Menu
      </Typography>

      {/* Search and Filter */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search dishes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={handleCategoryChange}
          aria-label="menu categories"
          sx={{ flexWrap: 'wrap', gap: 1 }}
        >
          {categories.map((category) => (
            <ToggleButton
              key={category}
              value={category}
              sx={{
                textTransform: 'capitalize',
                color: selectedCategory === category ? '#8B0000' : 'inherit',
                borderColor: selectedCategory === category ? '#8B0000' : 'inherit',
              }}
            >
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Menu Items Grid */}
      <Grid container spacing={4}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#8B0000' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={item.cuisine}
                      size="small"
                      sx={{ backgroundColor: '#FFD700', color: '#8B0000' }}
                    />
                    <Chip
                      label={`Serves ${item.serves}`}
                      size="small"
                      variant="outlined"
                    />
                    {item.dietary.map((diet, index) => (
                      <Chip
                        key={index}
                        label={diet}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                  <Typography variant="h6" sx={{ color: '#5D0000', fontWeight: 'bold' }}>
                    ${item.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 1 }}>
                      <IconButton 
                        size="small"
                        onClick={() => handleQuantityChange(item._id, -1)}
                        disabled={(quantities[item._id] || 1) <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ px: 2 }}>
                        {quantities[item._id] || 1}
                      </Typography>
                      <IconButton 
                        size="small"
                        onClick={() => handleQuantityChange(item._id, 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => handleAddToCart(item)}
                      sx={{
                        flex: 1,
                        backgroundColor: '#8B0000',
                        '&:hover': { backgroundColor: '#5D0000' },
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" sx={{ py: 4 }}>
              No dishes found. Try a different search or category.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Note about customization */}
      <Box sx={{ mt: 6, p: 3, backgroundColor: '#FFF8F0', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#8B0000' }}>
          Customize Your Menu
        </Typography>
        <Typography>
          All our dishes can be customized to suit your event needs. Contact us for:
        </Typography>
        <ul>
          <li>Bulk ordering discounts</li>
          <li>Special dietary requirements</li>
          <li>Custom menu creation</li>
          <li>Delivery and setup services</li>
        </ul>
        <Button
          variant="contained"
          href="/contact"
          sx={{
            backgroundColor: '#FFD700',
            color: '#8B0000',
            fontWeight: 'bold',
            mt: 2,
            '&:hover': { backgroundColor: '#B8860B' },
          }}
        >
          Request Custom Quote
        </Button>
      </Box>
    </Container>
  );
};

export default Menu;