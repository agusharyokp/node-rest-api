const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
    const AuthHeader = req.get("Authorization");
    if (!AuthHeader) {
        const error = new Error("Not authenticated.");
        error.statusCode = 401;
        throw error;
    }
    const token = AuthHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch(err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error("Not authenticated.");
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
}
