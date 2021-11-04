const { ObjectId } = require('mongoose').Types;
const Recipe = require('../models/Recipes');
const usersHelp = require('./users-helpers');

module.exports = {
    async validEntriesAdd(req) {
        const { name, ingredients, preparation } = req.body;
        const result = { status: 200, message: '', user: '' };

        if (!name || !ingredients || !preparation) {
            result.status = 400;
            result.message = 'Invalid entries. Try again.';
            return result;
        }

        const user = await usersHelp.getUserByToken(req);
        if (user === 0) {
            result.status = 401;
            result.message = 'jwt malformed';
            return result;
        }
        
        result.user = user;
        return result;
    },
    
    async validId(req) {
        const { id } = req.params;
        const result = { status: 200, message: '', recipe: 0 };
        if (!ObjectId.isValid(id)) {
            result.status = 404;
            result.message = 'recipe not found';
            return result;
        }
    
        const recipe = await Recipe.findById({ _id: id });

        result.recipe = recipe;
        return result;
    },
    
    async validUserOwnerRecipe(req, recipe) {
        const result = { status: 200, message: '', recipe: 0 };
    
        const user = await usersHelp.getUserByToken(req);
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
    },
};