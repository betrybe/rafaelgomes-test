var expect = require('chai').expect;
var chai = require('chai')
var chaiHttp = require('chai-http');

const frisby = require('frisby');
const fs = require('fs');
const path = require('path');

const Recipe = require('../models/Recipes');
const User = require('../models/Users');

var recipe = require('../controllers/RecipeController')
var user = require('../controllers/UserController')
const usersHelp = require('../helpers/users-helpers');
const recipesHelp = require('../helpers/recipes-helpers');
const app = require('../api/app');

chai.use(chaiHttp);

const url = 'http://localhost:3000';

let userToken;
let adminToken;
let userRecipe;

before(async () => {

    await Recipe.deleteMany({}).then(function(){
        console.log("Recipes deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
    
    await User.deleteMany({}).then(function(){
        console.log("Users deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });

    const users = [{ name: 'admin manual', email: 'admin@email.com', password: 'admin', role: 'admin' }];
    await User.insertMany(users);

});

describe('ROUTES', () => {
    describe('/POST /users', function() {
        it('should exists `/users` route', function(done) {
            chai.request(app)
            .post('/users')
            .end(function(error, res) {
                expect(res.status).to.be.equal(400);
            done();
            });
        });
        it('should be insert user from `/users` route', function(done) {
            chai.request(app)
            .post('/users')
            .send({
                name: "name test",
                email: "email@test.com",
                password: "123"
                })
            .end(function(error, res) {
                expect(res.status).to.be.equal(201);
            done();
            });
        });
    });

    describe('/POST /login', function() {
        it('should exists `/login` route', function(done) {
            chai.request(app)
            .post('/login')
            .end(function(error, res) {
                expect(res.status).to.be.equal(401);
            done();
            });
        });
        it('should be login user from `/login` route', function(done) {
            chai.request(app)
            .post('/login')
            .send({
                email: 'email@test.com',
                password: '123',
            })
            .end(function(error, res) {
                expect(res.status).to.be.equal(200);
                userToken = res.body.token;
            done();
            });
        });
        it('should be login admin from `/login` route', function(done) {
            chai.request(app)
            .post('/login')
            .send({
                email: 'admin@email.com',
                password: 'admin',
            })
            .end(function(error, res) {
                expect(res.status).to.be.equal(200);
                adminToken = res.body.token;
            done();
            });
        });
    });

    describe('/POST /users/admin', function() {
        it('should exists `/users/admin` route', function(done) {
            chai.request(app)
            .post('/users/admin')
            .end(function(error, res) {
                expect(res.status).to.be.equal(401);
            done();
            });
        });
        it('should be insert user admin from `/users/admin` route', function(done) {
            chai.request(app)
            .post('/users')
            .set('Authorization', adminToken)
            .send({
                name: "admin new test",
                email: "emailadmin@test.com",
                password: "123"
                })
            .end(function(error, res) {
                expect(res.status).to.be.equal(201);
            done();
            });
        });
    });

    describe('/POST /recipes', function() {
        it('should exists route', function(done) {
            chai.request(app)
            .post('/recipes')
            .end(function(error, res) {
                expect(res.status).to.be.equal(400);
            done();
            });
        });

        it('should be insert recipe from `/recipes` route', function(done) {
            chai.request(app)
            .post('/recipes')
            .set('Authorization', userToken)
            .send({
                name: 'receita user via rota',
                ingredients: 'arroz, alface',
                preparation: 'esquentar tudo junto',
            })
            .end(function(error, res) {
                expect(res.status).to.be.equal(201);
                expect(res.body.recipe.name).equal('receita user via rota');
                userRecipe = res.body.recipe;
            done();
            });
        });
    });

    describe('/GET /recipes', function() {
        it('should exists route', function(done) {
            chai.request(app)
            .get('/recipes')
            .end(function(error, res) {
                expect(res.status).to.be.equal(200);
            done();
            });
        });
    });

    describe('/GET /recipes/:id ', function() {
        it('should exists `recipes/:id` route', function(done) {
            chai.request(app)
            .get(`${url}/recipes/${userRecipe._id}`)
            .end(function(error, res) {
                expect(res.status).to.be.equal(404);
            done();
            });
        });
    });


    describe('/PUT /recipes/:id ', function() {
        
        it('should exists `/recipes` route', function(done) {
            chai.request(app)
            .put('/recipes/4646465465465')
            .end(function(error, res) {
                expect(res.status).to.be.equal(401);
            done();
            });
        });

        it('should be edit (user) recipe from `/recipes` route', function(done) {
            chai.request(app)
            .put(`/recipes/${userRecipe._id}`)
            .set('Authorization', userToken)
            .set('Content-Type', 'application/json')
            .send({
                name: 'receita atualizada por user',
                ingredients: 'arroz, alface, batata',
                preparation: 'esquentar tudo junto',
            })
            .end(function(error, res) {
                expect(res.status).to.be.equal(200);
                expect(res.body.name).equal('receita atualizada por user');
            done();
            });
        });

        it('should be edit (admin) recipe from `/recipes` route', function(done) {
            chai.request(app)
            .put(`/recipes/${userRecipe._id}`)
            .set('Authorization', adminToken)
            .set('Content-Type', 'application/json')
            .send({
                name: 'receita atualizada por user',
                ingredients: 'arroz, alface, batata',
                preparation: 'esquentar tudo junto',
            })
            .end(function(error, res) {
                expect(res.status).to.be.equal(200);
                expect(res.body.name).equal('receita atualizada por user');
            done();
            });
        });
    });


    describe('/PUT /recipes/:id/image ', function() {
        it('should exists `/recipes/:id/image` route', function(done) {
            chai.request(app)
            .put(`/recipes/${userRecipe._id}/image`)
            .end(function(error, res) {
                expect(res.status).to.be.equal(401);
            done();
            });
        });
        it('should be uploaded image to `/recipes/:id/image` route', function(done) {
            const photoFile = path.resolve(__dirname, '../uploads/ratinho.jpg');
            const content = fs.createReadStream(photoFile);
            
            chai.request(app)
            .put(`/recipes/${userRecipe._id}/image`)
            .set('Authorization', adminToken)
            .attach('image', content)
            .end(function(error, res) {
                expect(res.status).to.be.equal(200);
            done();
            });
        });
    });

    describe('/DELETE /recipes/:id ', function() {
        it('should exists route', function(done) {
            chai.request(app)
            .delete('/recipes/4646465465465')
            .end(function(error, res) {
                expect(res.status).to.be.equal(401);
            done();
            });
        });
    });



});

describe('USER', () => {

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

    describe('Helpers', () => {
    
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

        it('Should be validated getting user from token', async () => {
            req = {'headers' : { authorization: 'sdasdasdasda' } };
            expect(await usersHelp.getUserByToken(req)).to.be.equal(0);
        });

    });

});

describe('RECIPE', () => {

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

    });

    describe('Helpers', () => {

        it('Should be validated invalid entries', async () => {
            req = {'body' : { name: 'teste', ingredients: 'teste' } };
            resp = await recipesHelp.validEntriesAdd(req);
            expect(resp.status).to.be.equal(400);
        });

        it('Should be validated token invalid', async () => {
            req = {'body' : { name: 'teste', ingredients: 'teste', preparation: 'teste preparation' },
                'headers' : { authorization: 'tokeninvalido' } };
            resp = await recipesHelp.validEntriesAdd(req);
            expect(resp.status).to.be.equal(401);
        });

        it('Should be validated entries', async () => {
            req = {'body' : { name: 'teste', ingredients: 'teste', preparation: 'teste preparation' },
                'headers' : { authorization: userToken } };
            resp = await recipesHelp.validEntriesAdd(req);
            expect(resp.status).to.be.equal(200);
        });

        it('Should be validated find by id', async () => {
            req = {'params' : { id: '123' } };
            resp = await recipesHelp.validId(req);
            expect(resp.status).to.be.equal(404);
        });

        it('Should be validated if user is not owner of Recipe', async () => {
            req = {'params' : { id: '123' } };
            resp = await recipesHelp.validUserOwnerRecipe(req);
            expect(resp.status).to.be.equal(401);
        });

        it('Should be validated if token is not valid', async () => {
            req = {'headers' : { authorization: '123' } };
            async () => await verifyTokenHelp.checkToken(req, resp);
            expect(resp.status).to.be.equal(401);
        });

    });

    describe('Actions', () => {

        it('Should exists recipe by valid ID', async () => {
            req = {'params' : { id: userRecipe._id } };
            resp = await recipesHelp.validId(req);
            expect(resp.status).to.be.equal(200);
        });

        it('Should be validated if user is owner of Recipe', async () => {
            req = {
                'params' : { id: userRecipe }, 
                'headers' : { authorization: userToken },
                };
            resp = await recipesHelp.validUserOwnerRecipe(req, userRecipe);
            expect(resp.status).to.be.equal(200);
        });


        it('Should be deleted', async () => {
            await frisby
                .setup({
                    request: {
                        headers: {
                            Authorization: userToken,
                            'Content-Type': 'application/json',
                        },
                    },
                })
                .delete(`${url}/recipes/${userRecipe._id}`)
                .expect('status', 204);
        });


    });
    
});





