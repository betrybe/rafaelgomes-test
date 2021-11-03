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

async function validId(req) {
    const { id } = req.params;
    const result = { status: 200, message: '', recipe: 0 };

    if (!ObjectId.isValid(id)) {
        result.status = 404;
        result.message = 'recipe not found';
        return result;
    }

    const recipe = await Recipe.findById({ _id: id });
    if (!recipe) {
        result.status = 404;
        result.message = 'recipe not found';
        return result;
    } 
    result.recipe = recipe;
    return result;
}

async function validUserRecipe(req, recipe) {
    const result = { status: 200, message: '', recipe: 0 };
    const user = await validToken(req);
    if (user === 0) {
        result.status = 401;
        result.message = 'jwt malformed';
        return result;
    }

    if (recipe.userId.toString() !== user.id.toString() && user.role !== 'admin') {
        result.status = 401;
        result.message = 'jwt malformed';
        return result;
    } 

    return result;
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
    static async addRecipe(req, res) {
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
        // check if recipe exists
        const result = await validId(req);
        if (result.status !== 200) {
            res.status(result.status).json({ message: result.message });
            return;
        }
        const { recipe } = result;

        res.status(200).json(recipe);
    }

    static async editRecipe(req, res) {
        const { id } = req.params;
        
        // check if recipe exists
        let result = await validId(req);
        if (result.status !== 200) {
            res.status(result.status).json({ message: result.message });
            return;
        }
        const { recipe } = result;

        result = await validUserRecipe(req, recipe);
        if (result.status !== 200) {
            res.status(result.status).json({ message: result.message });
            return;
        }

        await Recipe.findByIdAndUpdate(id, req.body);
        const recipeUpdated = await Recipe.findById({ _id: id });
        res.status(200).json(recipeUpdated);
    }

    static async delRecipe(req, res) {
        const { id } = req.params;
        
        // check if recipe exists
        let result = await validId(req);
        if (result.status !== 200) {
            res.status(result.status).json({ message: result.message });
            return;
        }
        const { recipe } = result;

        result = await validUserRecipe(req, recipe);
        if (result.status !== 200) {
            res.status(result.status).json({ message: result.message });
            return;
        }

        await Recipe.findByIdAndRemove(id);
        res.status(204).json();
    }

    static async uploadImage(req, res) {
        // check if recipe exists
        let result = await validId(req);
        if (result.status !== 200) {
            res.status(result.status).json({ message: result.message });
            return;
        }
        const { recipe } = result;

        result = await validUserRecipe(req, recipe);
        if (result.status !== 200) {
            res.status(result.status).json({ message: result.message });
            return;
        }

        let image = '';
        if (req.file) {
            image = `${req.headers.host}/${req.file.path}`;
        }

        await Recipe.findByIdAndUpdate(req.params.id, { image });
        const recipeUpdated = await Recipe.findById(req.params.id);
        res.status(200).json(recipeUpdated);
    }

    static async getImage(req, res) {
        res.status(200).json();
    }
};
