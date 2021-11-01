const router = require('express').Router();

const RecipeController = require('../controllers/RecipeController');

// middleware
const verifyToken = require('../helpers/verify-token');

router.post('/', RecipeController.recipes);
router.get('/', RecipeController.getAll);
router.get('/:id', RecipeController.getRecipeById);
router.put('/:id', verifyToken, RecipeController.editRecipe);

module.exports = router;