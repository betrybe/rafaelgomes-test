const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;

// helpers
const getToken = require('../helpers/get-token');

const Recipe = require('../models/Recipes');
const User = require('../models/Users');

function validEntriesAdd(req) {
    const { name, ingredients, preparation } = req.body;
    const result = {
        status: 200,
        message: '',
        user: 0,
    };

    if (!name || !ingredients || !preparation) {
        result.status = 400;
        result.message = 'Invalid entries. Try again.';
        return result;
    }

    if (!req.headers.authorization) {
        result.status = 401;
        result.message = 'jwt malformed';
        return result;
    }

    return result;
}

async function validToken(req) {
    let currentUser;

    const token = getToken(req);
    let tokenDecoded = '';
    try {
        jwt.verify(token, 'SECRETFORCOOKMASTER', (err, decoded) => {
            if (err) return 0;
            tokenDecoded = decoded.id;
        });

        currentUser = await User.findById(tokenDecoded);

        return currentUser;
    } catch (error) {
        return 0;
    }
}

async function addRecipe(req, user) {
    const { name, ingredients, preparation } = req.body;
    const newRecipe = new Recipe({ name, ingredients, preparation, userId: user.id });
    try {
        const recipe = await newRecipe.save();
        return recipe;
    } catch (error) {
        return 0;
    }
}

module.exports = class RecipeController {
    static async recipes(req, res) {
        // validations
        try {
            const result = validEntriesAdd(req);
            if (result.status !== 200) {
                res.status(result.status).json({ message: result.message });
                return;
            } 
            const user = await validToken(req);
            if (user === 0) {
                res.status(401).json({ message: 'jwt malformed' });
                return;
            }
            // create a recipe
            const recipe = await addRecipe(req, user);
            if (recipe !== 0) {
                res.status(201).json({ recipe });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    }

    static async getRecipeById(req, res) {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(404).json({ message: 'recipe not found' });
            return;
        }

        const recipe = await Recipe.findById({ _id: id });
        if (!recipe) {
            res.status(404).json({ message: 'recipe not found' });
            return;
        }
        res.status(200).json(recipe);
    }

    static async editRecipe(req, res) {
        const { id } = req.params;
        
        // check if recipes exists
        const recipe = await Recipe.findById({ _id: id });
        if (!recipe) {
            res.status(404).json({ message: 'recipe not found' });
            return;
        }

        const user = await validToken(req);
        if (user === 0) {
            res.status(401).json({ message: 'jwt malformed' });
            return;
        }

        if (recipe.userId.toString() === user.id.toString() || user.role === 'admin') {
            await Recipe.findByIdAndUpdate(id, req.body);
            const recipeUpdated = await Recipe.findById({ _id: id });
            res.status(200).json(recipeUpdated);
        } else {
            res.status(401).json({ message: 'jwt malformed' });
        }
    }

    static async delRecipe(req, res) {
        const { id } = req.params;
        
        // check if recipes exists
        const recipe = await Recipe.findById({ _id: id });
        if (!recipe) {
            res.status(404).json({ message: 'recipe not found' });
            return;
        }

        const user = await validToken(req);
        if (user === 0) {
            res.status(401).json({ message: 'missing auth token' });
            return;
        }

        if (recipe.userId.toString() === user.id.toString() || user.role === 'admin') {
            await Recipe.findByIdAndRemove(id);
            res.status(204).json();
        } else {
            res.status(401).json({ message: 'missing auth token' });
        }
    }
};
