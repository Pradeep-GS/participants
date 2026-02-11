const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');

dotenv.config();

const products = [
    {
        name: 'Neural Processor X1',
        description: 'Advanced logical processing unit for high-fidelity rhythmic computing. KANAL 2k26 Certified flagship model.',
        price: 24999,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Hardware',
        countInStock: 15
    },
    {
        name: 'Logic Synth Wave',
        description: 'A professional synthesizer designed for the rhythm of digital logic. Crisp, clean, and futuristic tones.',
        price: 12499,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Audio',
        countInStock: 25
    },
    {
        name: 'Cyber Armor V2',
        description: 'Premium protective gear for logical architects. Lightweight carbon fiber weave with tactical aesthetics.',
        price: 4999,
        image: 'https://images.unsplash.com/photo-1558434078-92fe9822b706?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Apparel',
        countInStock: 50
    },
    {
        name: 'Quantum Optics',
        description: 'Visual enhancement units for processing complex logical patterns in real-time. High-refresh augmented reality.',
        price: 18999,
        image: 'https://images.unsplash.com/photo-1573333235115-7a540b58b375?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Optics',
        countInStock: 10
    },
    {
        name: 'Data Stream Core',
        description: 'High-speed storage module for rhythmic data pipelines. Reliable and fast flash memory architecture.',
        price: 8999,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Storage',
        countInStock: 30
    },
    {
        name: 'Logic Gate Pad',
        description: 'Multi-touch control surface for logical sequencing. Precision haptic feedback for every rhythm.',
        price: 15999,
        image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Hardware',
        countInStock: 12
    },
    {
        name: 'Binary Flux Mouse',
        description: 'Zero-latency logical input device. Customizable macros for rapid logic execution.',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Peripherals',
        countInStock: 40
    },
    {
        name: 'Hex Command Key',
        description: 'Mechanical logical interface with programmable switches. Premium aluminum build for KANAL durability.',
        price: 9999,
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Peripherals',
        countInStock: 20
    },
    {
        name: 'Rhythm Router',
        description: 'High-bandwidth connectivity hub for logical networks. Low latency and wide range wireless protocols.',
        price: 7499,
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Hardware',
        countInStock: 18
    },
    {
        name: 'Spectral Lens X',
        description: 'Advanced logical imaging sensor. Capture the rhythm of logic in ultra-high definition.',
        price: 32999,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Optics',
        countInStock: 8
    },
    {
        name: 'Logic Drone S1',
        description: 'Autonomous logical surveyor. Map complex environments with rhythmic precision.',
        price: 45999,
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Hardware',
        countInStock: 5
    },
    {
        name: 'Cyber Nexus Shell',
        description: 'Next-gen chassis for rhythmic computing builds. Modular design with RGB logical flow indicators.',
        price: 13999,
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        category: 'Hardware',
        countInStock: 10
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected for KANAL 2k26 (INR) seeding');
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        await Product.insertMany(products);
        console.log('Database Purged and Re-Seeded with 12 items in INR');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
