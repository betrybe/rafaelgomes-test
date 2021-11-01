const mongoose = require('../db/conn');

const Schemma = mongoose.Schema;

const Recipe = mongoose.model(
    'recipes',
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
    { versionKey: false }),
);

module.exports = Recipe;
