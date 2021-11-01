const validator = require('email-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/Users');

// helpers
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');

function validEntriesAdd(req) {
    const { name, email, password } = req.body;
    
    if (!email || !password || !name) {
        return false;
    }

    if (!validator.validate(email)) {
        return false;
    }

    return true;
}

function validEntriesLogin(req) {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return false;
    }

    if (!validator.validate(email)) {
        return false;
    }

    return true;
}

module.exports = class UserController {
    static async users(req, res) {
        const { name, email, password } = req.body;
        // validations
        if (!validEntriesAdd(req)) {
            res.status(400).json({ message: 'Invalid entries. Try again.' });
            return;
        } 
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(409).json({ message: 'Email already registered' });
            return;
        } 
        // create a user
        const newUser = new User({ name, email, password, role: 'user' });
        try {
            const nUser = await newUser.save();

            const user = { name: nUser.name, email: nUser.email, role: nUser.role, _id: nUser.id };

            res.status(201).json({ user });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;
        // validations
        if (!validEntriesLogin(req)) {
            res.status(401).json({ message: 'All fields must be filled' });
            return;
        } 

        const user = await User.findOne({ email, password });
        if (!user) {
            res.status(401).json({ message: 'Incorrect username or password' });
            return;
        } 

        await createUserToken(user, req, res);
    }

    static async checkUser(req, res) {
        let currentUser;
        
        if (req.headers.authorization) {
            const token = getToken(req);
            const decoded = jwt.verify(token, 'SECRETFORCOOKMASTER');
            currentUser = await User.findById(decoded.id);
        } else {
            currentUser = null;
        }

        res.status(200).send(currentUser);
    }
};
