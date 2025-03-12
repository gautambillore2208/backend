




const jwt = require('jsonwebtoken');
const User = require('../users/users.model'); // Ensure correct path
require('dotenv').config();

const jwt_SECRET=process.env.JWT_SECRET_KEY;

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            jwt_SECRET,
            { expiresIn: '1h' }
        );

        return token;
    } catch (error) {
        console.error("Token generation error:", error.message);
        return null;
    }
};

module.exports = generateToken;

