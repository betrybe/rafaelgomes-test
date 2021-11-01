const router = require('express').Router();

const RecipeController = require('../controllers/RecipeController');

// middleware
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');

router.post('/', RecipeController.recipes);
router.get('/', RecipeController.getAll);
router.get('/:id', RecipeController.getRecipeById);
router.put('/:id', verifyToken, RecipeController.editRecipe);
router.delete('/:id', verifyToken, RecipeController.delRecipe);
router.put('/:id/image', verifyToken, imageUpload.single('image'), RecipeController.uploadImage);

module.exports = router;