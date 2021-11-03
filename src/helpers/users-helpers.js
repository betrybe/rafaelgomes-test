const validator = require('email-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/Users');

module.exports = {
    validEntriesAdd(req) {
        const { name, email, password } = req.body;
        
        if (!email || !password || !name) {
            return false;
        }

        if (!validator.validate(email)) {
            return false;
        }

        return true;
    },

    async getUserByToken(req) {
        let currentUser = null;
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            const decoded = jwt.verify(token, 'SECRETFORCOOKMASTER');
            currentUser = await User.findById(decoded.id);
        }
        return currentUser;
    },

    validEntriesLogin(req) {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return false;
        }

        if (!validator.validate(email)) {
            return false;
        }

        return true;
    },
};