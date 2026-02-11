const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

// Prefix all API routes with /api
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Root API route to confirm server is running
app.get('/api', (req, res) => {
    res.json({ message: 'VSBECART API is running', version: '1.0.0' });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('DB Connection Error:', err));

// --- Production / StackBlitz Setup ---
// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend/dist');
const isProduction = process.env.NODE_ENV === 'production' || process.env.STACKBLITZ;

if (isProduction) {
    console.log('Mode: Production/StackBlitz (Serving Static Files)');
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(frontendPath, 'index.html'));
    });
} else {
    console.log('Mode: Development');
    // In development, handle the root / with a helpful message
    app.get('/', (req, res) => {
        res.send('Backend Server is running. Access the frontend via Vite dev server or build the project.');
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

