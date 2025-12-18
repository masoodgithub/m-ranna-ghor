const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const ContactInquiry = require('./models/ContactInquiry');
require('dotenv').config();

const sampleMenuItems = [
  {
    name: "Peking Duck Feast",
    description: "Traditional Beijing-style roasted duck served with thin pancakes, spring onions, cucumber, and hoisin sauce. Perfect for celebrations.",
    price: 299,
    category: "main",
    cuisine: "chinese",
    serves: 10,
    dietary: ["gluten-free"],
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    preparationTime: 60
  },
  {
    name: "Butter Chicken Deluxe",
    description: "Tender chicken pieces in a rich, creamy tomato and butter curry. Served with garlic naan and basmati rice.",
    price: 199,
    category: "main",
    cuisine: "indian",
    serves: 8,
    dietary: ["spicy"],
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    preparationTime: 45
  },
  {
    name: "Sushi & Sashimi Platter",
    description: "Premium assortment of fresh salmon, tuna, and yellowtail sushi, nigiri, and sashimi. Includes wasabi, ginger, and soy sauce.",
    price: 249,
    category: "main",
    cuisine: "japanese",
    serves: 6,
    dietary: [],
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    preparationTime: 50
  },
  {
    name: "Pad Thai Noodles",
    description: "Authentic Thai stir-fried rice noodles with tofu, shrimp, bean sprouts, peanuts, and lime. Sweet, sour, and savory balance.",
    price: 159,
    category: "main",
    cuisine: "thai",
    serves: 6,
    dietary: ["spicy"],
    imageUrl: "https://images.unsplash.com/photo-1559314809-2b99056a8c4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    preparationTime: 30
  },
  {
    name: "Vegetable Spring Rolls",
    description: "Crispy golden rolls filled with fresh cabbage, carrots, mushrooms, and glass noodles. Served with sweet chili dipping sauce.",
    price: 89,
    category: "appetizer",
    cuisine: "chinese",
    serves: 6,
    dietary: ["vegetarian"],
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    preparationTime: 25
  },
  {
    name: "Mango Sticky Rice",
    description: "Sweet Thai dessert featuring glutinous rice cooked in coconut milk, served with fresh ripe mango slices and toasted sesame seeds.",
    price: 119,
    category: "dessert",
    cuisine: "thai",
    serves: 4,
    dietary: ["vegetarian", "gluten-free"],
    imageUrl: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    preparationTime: 20
  },
  {
    name: "Korean BBQ Platter",
    description: "Assorted marinated meats (bulgogi, galbi) with lettuce wraps, kimchi, pickled vegetables, and dipping sauces.",
    price: 279,
    category: "main",
    cuisine: "korean",
    serves: 8,
    dietary: ["spicy"],
    imageUrl: "https://images.unsplash.com/photo-1551503759-13c5d14c4c8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    preparationTime: 55
  },
  {
    name: "Vegetable Biryani",
    description: "Fragrant basmati rice cooked with mixed vegetables, saffron, and aromatic spices. Served with raita.",
    price: 169,
    category: "main",
    cuisine: "indian",
    serves: 6,
    dietary: ["vegetarian"],
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    preparationTime: 40
  }
];

const sampleInquiries = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    eventDate: new Date("2024-03-15"),
    guestCount: 120,
    eventType: "wedding",
    message: "Looking for catering for our wedding reception. Need vegetarian options for 30% of guests.",
    status: "contacted"
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    eventDate: new Date("2024-02-20"),
    guestCount: 60,
    eventType: "corporate",
    message: "Corporate annual dinner. Budget flexible. Need formal presentation.",
    status: "quoted"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await MenuItem.deleteMany({});
    await ContactInquiry.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Insert menu items
    await MenuItem.insertMany(sampleMenuItems);
    console.log(`📋 Added ${sampleMenuItems.length} menu items`);

    // Insert inquiries
    await ContactInquiry.insertMany(sampleInquiries);
    console.log(`📧 Added ${sampleInquiries.length} sample inquiries`);

    // Get counts
    const menuCount = await MenuItem.countDocuments();
    const inquiryCount = await ContactInquiry.countDocuments();
    
    console.log('\n📊 Database Summary:');
    console.log(`   Menu Items: ${menuCount}`);
    console.log(`   Inquiries: ${inquiryCount}`);
    console.log('\n✅ Database seeded successfully!');

    mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();