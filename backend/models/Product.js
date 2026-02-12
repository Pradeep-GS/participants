const { createModel } = require('../db/jsonDb');

const Product = createModel('products');

module.exports = Product;
