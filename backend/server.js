const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

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
    res.json({ message: 'VSBECART API is running', version: '1.0.0', database: 'jsonDb (StackBlitz compatible)' });
});

// --- Seed endpoint: allows seeding from the browser in StackBlitz ---
app.post('/api/seed', async (req, res) => {
    try {
        const seedData = require('./seedData');
        const Product = require('./models/Product');
        const User = require('./models/User');
        const Cart = require('./models/Cart');

        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();
        await Product.insertMany(seedData);

        res.json({ message: 'Database seeded successfully', productsCount: seedData.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Also seed on startup if products collection is empty
(async () => {
    try {
        const Product = require('./models/Product');
        const count = await Product.countDocuments();
        if (count === 0) {
            const seedData = require('./seedData');
            await Product.insertMany(seedData);
            console.log(`Auto-seeded ${seedData.length} products into jsonDb`);
        } else {
            console.log(`jsonDb: ${count} products already exist, skipping auto-seed`);
        }
    } catch (e) {
        console.error('Auto-seed error:', e.message);
    }
})();

console.log('Database: Using jsonDb (JSON file-based, StackBlitz compatible)');

// --- Production / StackBlitz Setup ---
// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend/dist');
const isStackBlitz = process.env.STACKBLITZ || process.env.STKBLITZ || !!process.env.PROJECT_ID;
const isProduction = process.env.NODE_ENV === 'production' || isStackBlitz;

if (isProduction || fs.existsSync(frontendPath)) {
    if (fs.existsSync(frontendPath)) {
        console.log('Mode: Serving Static Files (Frontend dist found)');
        app.use(express.static(frontendPath));
        // Express 5 requires named wildcard params — use '/{*splat}' instead of '*'
        app.get('/{*splat}', (req, res) => {
            // Only serve index.html if it's not an API route (which are already handled above)
            if (!req.path.startsWith('/api')) {
                res.sendFile(path.resolve(frontendPath, 'index.html'));
            } else {
                res.status(404).json({ error: 'API route not found' });
            }
        });
    } else {
        console.warn('WARNING: Frontend dist folder not found at:', frontendPath);
        app.get('/', (req, res) => {
            res.status(404).send(`
                <div style="font-family: sans-serif; padding: 50px; text-align: center;">
                    <h1>Frontend build not found</h1>
                    <p>Please run <code>npm run build-frontend</code> in the root directory.</p>
                </div>
            `);
        });
    }
} else {
    console.log('Mode: Development');
    app.get('/', (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(`
            <div style="font-family: sans-serif; padding: 50px; text-align: center; background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div style="background: rgba(56, 189, 248, 0.1); padding: 40px; border-radius: 24px; border: 1px solid rgba(56, 189, 248, 0.2); max-width: 600px;">
                    <h1 style="color: #38bdf8; margin-bottom: 20px;">🚀 VSBECART API is Active</h1>
                    <p style="font-size: 1.2rem; color: #94a3b8;">The backend server is running successfully.</p>
                    <div style="margin: 20px 0; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; text-align: left;">
                        <p><strong>API Endpoint:</strong> <code>/api</code></p>
                        <p><strong>Database:</strong> jsonDb (StackBlitz compatible)</p>
                        <p><strong>Status:</strong> Online</p>
                    </div>
                    <p style="color: #64748b; font-size: 0.9rem;">If you are running the frontend separately (Vite), please open the frontend URL directly.</p>
                </div>
            </div>
        `);
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
