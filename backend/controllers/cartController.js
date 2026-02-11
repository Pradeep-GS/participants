const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += parseInt(quantity);
        } else {
            cart.items.push({ productId, quantity: parseInt(quantity) });
        }

        await cart.save();
        const populatedCart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        res.json(populatedCart.items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
            await cart.save();
        }
        // Filter out items where productId is null (deleted products)
        const validItems = cart.items.filter(item => item.productId !== null);
        res.json(validItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        const populatedCart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        res.json(populatedCart.items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
