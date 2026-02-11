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

const fs = require('fs');

if (isProduction) {
    if (fs.existsSync(frontendPath)) {
        console.log('Mode: Production/StackBlitz (Serving Static Files)');
        app.use(express.static(frontendPath));
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(frontendPath, 'index.html'));
        });
    } else {
        console.warn('WARNING: Frontend dist folder not found at:', frontendPath);
        app.get('*', (req, res) => {
            res.status(404).send('Frontend build (dist) not found. Please run "npm run build" in the frontend directory.');
        });
    }
} else {
    console.log('Mode: Development');
    app.get('/', (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(`
            <div style="font-family: sans-serif; padding: 50px; text-align: center; background: #0f172a; color: #f8fafc; min-height: 100vh;">
                <h1 style="color: #38bdf8;">VSBECART Backend is Running</h1>
                <p>To view the app, visit the frontend dev server:</p>
                <a href="http://localhost:5173" style="color: #38bdf8; font-size: 1.5rem;">http://localhost:5173</a>
                <p style="margin-top: 30px; color: #94a3b8;">(Or run <code>npm run build</code> in the frontend folder to serve it from this port)</p>
            </div>
        `);
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

