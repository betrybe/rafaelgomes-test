const mongoose = require('../db/conn');

const { Schemma } = mongoose;

const Recipe = mongoose.model(
    'Recipe',
    new Schemma({
        name: {
            type: String,
            required: true,
        },
        ingredients: {
            type: String,
            required: true,
        },
        preparation: {
            type: String,
            required: true,
        },
        userId: Object,
    },
    { timestamps: true }),
);

module.exports = Recipe;
