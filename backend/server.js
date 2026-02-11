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

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('DB Connection Error:', err));

// --- Production Setup ---
// Serve frontend static files if in production or running in environments like StackBlitz
if (process.env.NODE_ENV === 'production' || process.env.STACKBLITZ) {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendPath));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(frontendPath, 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

