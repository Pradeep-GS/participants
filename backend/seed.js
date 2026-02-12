/**
 * seed.js - Seeds the JSON database with product data
 * Works both locally and in StackBlitz (no MongoDB required)
 */
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const products = require('./seedData');

dotenv.config();

async function seed() {
    try {
        console.log('Starting KANAL 2k26 (INR) seeding...');

        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        await Product.insertMany(products);

        console.log(`Database Purged and Re-Seeded with ${products.length} items in INR`);
        console.log('Data saved to data.json');
        process.exit();
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
