var expect = require('chai').expect;

var recipe = require('../controllers/RecipeController')
var user = require('../controllers/UserController')

const usersHelp = require('../helpers/users-helpers');

describe('SMOKE TESTS', () => {

    describe('Users', () => {

        it('should exist the `addUser`', () => {
            expect(user.addUser).to.exist;
        });

        it('should exist the `login`', () => {
            expect(user.login).to.exist;
        });

        it('should exist the `validEntriesAdd`', () => {
            expect(usersHelp.validEntriesAdd).to.exist;
        });

        it('should exist the `validEntriesLogin`', () => {
            expect(usersHelp.validEntriesLogin).to.exist;
        });

    });

    describe('Recipes', () => {

        it('should exist the `addRecipe`', () => {
            expect(recipe.addRecipe).to.exist;
        });

        it('should exist the `editRecipe`', () => {
            expect(recipe.editRecipe).to.exist;
        });

        it('should exist the `delRecipe`', () => {
            expect(recipe.delRecipe).to.exist;
        });

        it('should exist the `getAll`', () => {
            expect(recipe.getAll).to.exist;
        });

        it('should exist the `getRecipeById`', () => {
            expect(recipe.getRecipeById).to.exist;
        });

        it('should exist the `uploadImage`', () => {
            expect(recipe.uploadImage).to.exist;
        });
        
        it('should exist the `getImage`', () => {
            expect(recipe.getImage).to.exist;
        });
    });
});