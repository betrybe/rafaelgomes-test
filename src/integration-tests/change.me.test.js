var expect = require('chai').expect;
const frisby = require('frisby');
const { MongoClient } = require('mongodb');
var recipe = require('../controllers/RecipeController')
var user = require('../controllers/UserController')
const usersHelp = require('../helpers/users-helpers');
const verifyTokenHelp = require('../helpers/verify-token');

describe('HELPERS', () => {

    describe('Users', () => {
    
        it('Should be validated invalid entries', async () => {
            req = {'body' : { name: 'teste' } };
            expect(usersHelp.validEntriesAdd(req)).to.be.equal(false);
        });
        
        it('Should be validated invalid email', async () => {
            req = {'body' : { name: 'teste', email: 'teste@', password: '123456' } };
            expect(usersHelp.validEntriesAdd(req)).to.be.equal(false);
        });
        
        it('Should be validated entries', async () => {
            req = {'body' : { name: 'teste', email: 'teste@email.com', password: '123456' } };
            expect(usersHelp.validEntriesAdd(req)).to.be.equal(true);
        });

        it('Should be validated incorrect data to login', async () => {
            req = {'body' : { email: 'teste@teste.com' } };
            expect(usersHelp.validEntriesLogin(req)).to.be.equal(false);
        });

        it('Should be validated correct data to login', async () => {
            req = {'body' : { email: 'teste@teste.com', password: '123456' } };
            expect(usersHelp.validEntriesLogin(req)).to.be.equal(true);
        });

    });

    describe('Token', () => {
        
        it('Should be validated invalid email', async () => {
            req = {'body' : { name: 'teste', email: 'teste@', password: '123456' } };
            expect(usersHelp.validEntriesAdd(req)).to.be.equal(false);
        });
        
        it('Should be validated entries', async () => {
            req = {'body' : { name: 'teste', email: 'teste@email.com', password: '123456' } };
            expect(usersHelp.validEntriesAdd(req)).to.be.equal(true);
        });

        it('Should be validated incorrect data to login', async () => {
            req = {'body' : { email: 'teste@teste.com' } };
            expect(usersHelp.validEntriesLogin(req)).to.be.equal(false);
        });

        it('Should be validated correct data to login', async () => {
            req = {'body' : { email: 'teste@teste.com', password: '123456' } };
            expect(usersHelp.validEntriesLogin(req)).to.be.equal(true);
        });

    });

});


describe('Recipe', () => {

    describe('Smoke Tests', () => {

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

        // it('should return `recipe not found` when id not found in database', () => {
        //     expect(recipe.validId(3)).to.be.equal('recipe not found');
        // });

    });
    
});

describe('User', () => {

    describe('Smoke Tests', () => {

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

    describe('CRUD', () => {

        const mongoDbUrl = 'mongodb://localhost:27017/Cookmaster';
        const url = 'http://localhost:3000';

        let connection;
        let db;

        before(async () => {
            connection = await MongoClient.connect(mongoDbUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            db = connection.db('Cookmaster');
        });

        it('Should be added', async () => {
            await frisby
                .post(`${url}/users/`,
                    {
                        name: 'teste automatico',
                        email: 'teste@email.com',
                        password: 'teste',
                    })
                .expect('status', 201)
                .then((response) => {
                    
                    const { body } = response;
                    
                    const result = JSON.parse(body);
                    expect(result.user.name).equal('teste automatico');
                });
        });

    });
    
});
