// const User = require('../models/User');

const User = require('../models/Users');

function validEntries(req) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return false;
    } 
    return true;
}

module.exports = class UserController {
    static async users(req, res) {
        const { name, email, password } = req.body;
        // validations
        if (!validEntries(req)) {
            res.status(400).json({ message: 'Invalid entries. Try again.' });
            return;
        } 
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(409).json({ message: 'Email already registered' });
            return;
        } 
        // create a user
        const addUser = new User({ name, email, password, role: 'user' });
        try {
            const user = await addUser.save();
            res.status(201).json({ user });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
};
