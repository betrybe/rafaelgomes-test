const jwt = require('jsonwebtoken');

// middleware to validate token
const checkToken = async (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: 'missing auth token' });
    }

    try {
        const verified = jwt.verify(token, 'SECRETFORCOOKMASTER');
        req.user = verified;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'jwt malformed' });
    }
};

module.exports = checkToken;