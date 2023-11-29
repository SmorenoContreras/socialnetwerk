const jwt = require('jsonwebtoken');
require("dotenv").config();

// For generating Token
exports.getToken = async (body) => {
    return await jwt.sign(body, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
};

