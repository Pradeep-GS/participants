const { createModel } = require('../db/jsonDb');

const User = createModel('users');

module.exports = User;
