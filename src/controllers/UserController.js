const User = require('../models/Users');

// helpers
const usersHelp = require('../helpers/users-helpers');
const createUserToken = require('../helpers/create-user-token');

module.exports = class UserController {
    static async addUser(req, res) {
        const { name, email, password } = req.body;
        // validations
        if (!usersHelp.validEntriesAdd(req)) {
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
            const nUsr = await newUser.save();
            const user = { name: nUsr.name, email: nUsr.email, role: 'user', _id: nUsr.id };
            res.status(201).json({ user });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;
        // validations
        if (!usersHelp.validEntriesLogin(req)) {
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

    static async addUserAdmin(req, res) {
        const { name, email, password } = req.body;
        const currentUser = await usersHelp.getUserByToken(req);
        if (!currentUser) {
            res.status(401).json({ message: 'All fields must be filled' });
            return;
        }
        if (currentUser.role === 'admin') {
            // create a user
            const newUser = new User({ name, email, password, role: 'admin' });
            try {
                const nUsr = await newUser.save();
                const user = { name: nUsr.name, email: nUsr.email, role: 'admin', _id: nUsr.id };
                res.status(201).json({ user });
            } catch (error) {
                res.status(500).json({ message: error });
            }
        } else {
            res.status(403).json({ message: 'Only admins can register new admins' });
        }
    }
};
