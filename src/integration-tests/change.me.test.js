var expect = require('chai').expect;
var chai = require('chai')
var chaiHttp = require('chai-http');

const frisby = require('frisby');
const { MongoClient } = require('mongodb');

var recipe = require('../controllers/RecipeController')
var user = require('../controllers/UserController')
const usersHelp = require('../helpers/users-helpers');
const recipesHelp = require('../helpers/recipes-helpers');
const app = require('../api/app');



chai.use(chaiHttp);

const mongoDbUrl = 'mongodb://localhost:27017/Cookmaster';
const url = 'http://localhost:3000';

let connection;
let db;

let userToken;
let adminToken;

before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');

    await db.collection('users').deleteMany({});
    await db.collection('recipes').deleteMany({});

    const users = [
        { name: 'admin teste', email: 'admin@email.com', password: 'admin', role: 'admin' },
        { name: 'user teste', email: 'user@email.com', password: 'user', role: 'user' }
    ];
    await db.collection('users').insertMany(users);

    await frisby
    .post(`${url}/login/`,
        {
            email: 'user@email.com',
            password: 'user',
        })
    .expect('status', 200)
    .then((response) => {
        
        const { body } = response;
        
        const result = JSON.parse(body);
        userToken = result.token;
    });

    await frisby
    .post(`${url}/login/`,
        {
            email: 'admin@email.com',
            password: 'admin',
        })
    .expect('status', 200)
    .then((response) => {
        
        const { body } = response;
        
        const result = JSON.parse(body);
        adminToken = result.token;
    });

});

describe('ROUTES', () => {
    describe('/POST /users', function() {
        it('should exists route', function(done) {
            chai.request(app)
            .post('/users')
            .end(function(error, res) {
                expect(res.status).to.be.equal(400);
            done();
            });
        });
    });

    describe('/POST /login', function() {
        it('should exists route', function(done) {
            chai.request(app)
            .post('/login')
            .end(function(error, res) {
                expect(res.status).to.be.equal(401);
            done();
            });
        });
    });

    describe('/POST /users/admin', function() {
        it('should exists route', function(done) {
            chai.request(app)
            .post('/users/admin')
            .end(function(error, res) {
                expect(res.status).to.be.equal(401);
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
        it('should exists route', function(done) {
            chai.request(app)
            .get('/recipes/4646465465465')
            .end(function(error, res) {
                expect(res.status).to.be.equal(404);
            done();
            });
        });
    });


    describe('/PUT /recipes/:id ', function() {
        it('should exists route', function(done) {
            chai.request(app)
            .put('/recipes/4646465465465')
            .end(function(error, res) {
                expect(res.status).to.be.equal(401);
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

    describe('Actions', () => {

        it('Should be added', async () => {
            await frisby
                .post(`${url}/users/`,
                    {
                        name: 'user teste 2',
                        email: 'user2@email.com',
                        password: 'teste',
                    })
                .expect('status', 201)
                .then((response) => {
                    const { json } = response;
                    expect(json.user.name).equal('user teste 2');
                });
        });

        it('Should be added admin', async () => {
            await frisby
            .post(`${url}/login/`,
                {
                email: 'admin@email.com',
                password: 'admin',
                })
            .expect('status', 200)
            .then((response) => {
                const { body } = response;
                result = JSON.parse(body);
                return frisby
                .setup({
                    request: {
                    headers: {
                        Authorization: result.token,
                        'Content-Type': 'application/json',
                    },
                    },
                })
                .post(`${url}/users/admin`,
                    {
                    name: 'admin novo teste',
                    email: 'admin2@email.com',
                    password: 'admin',
                    })
                .expect('status', 201)
                .then((responseAdmin) => {
                    const { json } = responseAdmin;
                    expect(json.user.name).equal('admin novo teste');
                });
            });
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

        let userRecipe;

        it('Should be added', async () => {
            await frisby
                .setup({
                    request: {
                    headers: {
                        Authorization: userToken,
                        'Content-Type': 'application/json',
                    },
                    },
                })
                .post(`${url}/recipes/`,
                    {
                        name: 'receita user teste',
                        ingredients: 'arroz, feijão',
                        preparation: 'esquentar tudo junto',
                    })
                .expect('status', 201)
                .then((response) => {
                    
                    const { body } = response;
                    const result = JSON.parse(body);
                    expect(result.recipe.name).equal('receita user teste');
                    userRecipe = result.recipe;
                });
        });

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


        it('Should be updated', async () => {
            await frisby
                .setup({
                    request: {
                        headers: {
                            Authorization: userToken,
                            'Content-Type': 'application/json',
                        },
                    },
                })
                .put(`${url}/recipes/${userRecipe._id}`,
                    {
                        name: 'receita updated',
                        ingredients: 'arroz, feijão, batata',
                        preparation: 'esquentar tudo junto',
                    })
                .expect('status', 200);
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





