const { createModel } = require('../db/jsonDb');

const Cart = createModel('carts');

module.exports = Cart;
