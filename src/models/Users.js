const mongoose = require('../db/conn');

// const { Schemma } = mongoose;
const Schemma = mongoose.Schema;

const User = mongoose.model(
    'users',
    new Schemma({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
    },
    { versionKey: false }),
);

module.exports = User;
