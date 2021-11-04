var expect = require('chai').expect;
var chai = require('chai')
var chaiHttp = require('chai-http');

const fs = require('fs');
const path = require('path');

const Recipe = require('../models/Recipes');
const User = require('../models/Users');

const app = require('../api/app');

chai.use(chaiHttp);

let userToken;
let user2Token;
let adminToken;
let userRecipe;
let user2Recipe;
let user2Recipe2;

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

describe('INTEGRATION TESTS', () => {
    describe('/POST /users', function() {
        it('should exists `/users` route', function(done) {
            chai.request(app)
            .post('/users')
            .end(function(error, res) {
                expect(res.status).to.be.equal(400);
            done();
            });
        });
        it('should be insert user 1 from `/users` route', function(done) {
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
        it('should be insert user 2 from `/users` route', function(done) {
            chai.request(app)
            .post('/users')
            .send({
                name: "name 2 test",
                email: "email2@test.com",
                password: "123"
                })
            .end(function(error, res) {
                expect(res.status).to.be.equal(201);
            done();
            });
        });
        it('should not be insert user with repeated email from `/users` route', function(done) {
            chai.request(app)
            .post('/users')
            .send({
                name: "name test",
                email: "email@test.com",
                password: "123"
                })
            .end(function(error, res) {
                expect(res.status).to.be.equal(409);
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
        it('should not be login with invalid user from `/login` route', function(done) {
            chai.request(app)
            .post('/login')
            .send({
                email: 'emailinexistente@test.com',
                password: '123',
            })
            .end(function(error, res) {
                expect(res.status).to.be.equal(401);
                userToken = res.body.token;
            done();
            });
        });
        it('should be login user 1 from `/login` route', function(done) {
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
        it('should be login user 2 from `/login` route', function(done) {
            chai.request(app)
            .post('/login')
            .send({
                email: 'email2@test.com',
                password: '123',
            })
            .end(function(error, res) {
                expect(res.status).to.be.equal(200);
                user2Token = res.body.token;
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
        it('should not be insert admin from `/users/admin` route', function(done) {
            chai.request(app)
            .post('/users/admin')
            .set('Authorization', userToken)
            .send({
                name: "name admin",
                email: "adminviarota@test.com",
                password: "123"
                })
            .end(function(error, res) {
                expect(res.status).to.be.equal(403);
            done();
            });
        });
        it('should be insert admin from `/users/admin` route', function(done) {
            chai.request(app)
            .post('/users/admin')
            .set('Authorization', adminToken)
            .send({
                name: "name admin",
                email: "adminviarota@test.com",
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
        it('should be insert recipe1 from `/recipes` route (user2)', function(done) {
            chai.request(app)
            .post('/recipes')
            .set('Authorization', user2Token)
            .send({
                name: 'receita user2 via rota',
                ingredients: 'arroz, alface',
                preparation: 'esquentar tudo junto',
            })
            .end(function(error, res) {
                expect(res.status).to.be.equal(201);
                expect(res.body.recipe.name).equal('receita user2 via rota');
                user2Recipe = res.body.recipe;
            done();
            });
        });
        it('should be insert recipe2 from `/recipes` route (user2)', function(done) {
            chai.request(app)
            .post('/recipes')
            .set('Authorization', user2Token)
            .send({
                name: 'receita2 user2 via rota',
                ingredients: 'arroz, alface',
                preparation: 'esquentar tudo junto',
            })
            .end(function(error, res) {
                expect(res.status).to.be.equal(201);
                expect(res.body.recipe.name).equal('receita2 user2 via rota');
                user2Recipe2 = res.body.recipe;
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
            .get(`/recipes/123456`)
            .end(function(error, res) {
                expect(res.status).to.be.equal(404);
            done();
            });
        });
        it('should be get recipe from `recipes/:id` route', function(done) {
            chai.request(app)
            .get(`/recipes/${userRecipe._id}`)
            .end(function(error, res) {
                expect(res.status).to.be.equal(200);
            done();
            });
        });
    });


    describe('/PUT /recipes/:id ', function() {
        
        it('should exists `/recipes` route', function(done) {
            chai.request(app)
            .put('/recipes/')
            .end(function(error, res) {
                expect(res.status).to.be.equal(404);
            done();
            });
        });

        it('should not be edit (user) recipe from `/recipes` route', function(done) {
            chai.request(app)
            .put('/recipes/454654564')
            .set('Authorization', user2Token)
            .end(function(error, res) {
                expect(res.status).to.be.equal(404);
            done();
            });
        });

        it('should not be edit (user2) recipe from `/recipes` route', function(done) {
            chai.request(app)
            .put(`/recipes/${userRecipe._id}`)
            .set('Authorization', user2Token)
            .set('Content-Type', 'application/json')
            .send({
                name: 'receita atualizada por user',
                ingredients: 'arroz, alface, batata',
                preparation: 'esquentar tudo junto',
            })
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
            .set('Authorization', user2Token)
            .end(function(error, res) {
                expect(res.status).to.be.equal(401);
            done();
            });
        });

        it('should not be uploaded image to invalid recipe from `/recipes/:id/image` route', function(done) {
            const photoFile = path.resolve(__dirname, '../uploads/ratinho.jpg');
            const content = fs.createReadStream(photoFile);
            
            chai.request(app)
            .put(`/recipes/1234/image`)
            .set('Authorization', adminToken)
            .attach('image', content)
            .end(function(error, res) {
                expect(res.status).to.be.equal(404);
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
            .delete(`/recipes/123`)
            .set('Authorization',userToken)
            .end(function(error, res) {
                expect(res.status).to.be.equal(404);
            done();
            });
        });

        it('should not be delete recipe with invalid user', function(done) {
            chai.request(app)
            .delete(`/recipes/${user2Recipe._id}`)
            .set('Authorization',userToken)
            .end(function(error, res) {
                expect(res.status).to.be.equal(401);
            done();
            });
        });



        it('should be delete recipe with valid user', function(done) {
            chai.request(app)
            .delete(`/recipes/${user2Recipe._id}`)
            .set('Authorization',user2Token)
            .end(function(error, res) {
                expect(res.status).to.be.equal(204);
            done();
            });
        });


        it('should be delete recipe with admin', function(done) {
            chai.request(app)
            .delete(`/recipes/${user2Recipe2._id}`)
            .set('Authorization',adminToken)
            .end(function(error, res) {
                expect(res.status).to.be.equal(204);
            done();
            });
        });
    });
});




