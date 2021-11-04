const router = require('express').Router();

const RecipeController = require('../controllers/RecipeController');

router.get('/:id', RecipeController.getImage);

module.exports = router;