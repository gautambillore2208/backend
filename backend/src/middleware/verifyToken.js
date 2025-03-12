


const jwt = require("jsonwebtoken");

const jwt_SECRET = process.env.JWT_SECRET_KEY; // ✅ Ensure correct ENV variable name

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        // const token = req.headers["authorization"]?.split(" ")[1];

        console.log("Received Token:", token); // Debugging

        if (!token) {
            return res.status(401).send({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, jwt_SECRET);
        console.log("Decoded Token:", decoded); // Debugging

        if (!decoded) {
            return res.status(401).send({ message: "Unauthorized: Invalid token" });
        }

        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (error) {
        console.error("Token Verification Error:", error); // Debugging
        return res.status(401).send({ message: "Unauthorized: Token verification failed" });
    }
};

module.exports = verifyToken;
