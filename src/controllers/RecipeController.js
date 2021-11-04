// helpers
const recipesHelp = require('../helpers/recipes-helpers');

const Recipe = require('../models/Recipes');

module.exports = class RecipeController {
    static async addRecipe(req, res) {
        // validations
        try {
            const result = await recipesHelp.validEntriesAdd(req);

            if (result.status !== 200) {
                res.status(result.status).json({ message: result.message });
                return;
            }

            const { user } = result;

            // create a recipe
            const { name, ingredients, preparation } = req.body;
            const nRec = new Recipe({ name, ingredients, preparation, userId: user.id });
            const recipe = await nRec.save();
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
        const result = await recipesHelp.validId(req);
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
        let result = await recipesHelp.validId(req);
        if (result.status !== 200) {
            res.status(result.status).json({ message: result.message });
            return;
        }
        const { recipe } = result;

        result = await recipesHelp.validUserOwnerRecipe(req, recipe);
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
        let result = await recipesHelp.validId(req);
        if (result.status !== 200) {
            res.status(result.status).json({ message: result.message });
            return;
        }
        const { recipe } = result;

        result = await recipesHelp.validUserOwnerRecipe(req, recipe);
        if (result.status !== 200) {
            res.status(result.status).json({ message: result.message });
            return;
        }

        await Recipe.findByIdAndRemove(id);
        res.status(204).json();
    }

    static async uploadImage(req, res) {
        // check if recipe exists
        let result = await recipesHelp.validId(req);
        if (result.status !== 200) {
            res.status(result.status).json({ message: result.message });
            return;
        }
        const { recipe } = result;

        result = await recipesHelp.validUserOwnerRecipe(req, recipe);
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
