const router = require('express').Router();

const RecipeController = require('../controllers/RecipeController');

// middleware
const verifyToken = require('../helpers/verify-token');

router.post('/', RecipeController.recipes);
router.get('/', RecipeController.getAll);
router.get('/:id', RecipeController.getRecipeById);
router.put('/:id', verifyToken, RecipeController.editRecipe);
router.delete('/:id', verifyToken, RecipeController.delRecipe);

module.exports = router;