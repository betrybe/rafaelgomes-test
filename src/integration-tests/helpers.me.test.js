var expect = require('chai').expect;

const usersHelp = require('../helpers/users-helpers');
const recipesHelp = require('../helpers/recipes-helpers');

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

        it('Should be validated getting user from token', async () => {
            req = {'headers' : { authorization: 'sdasdasdasda' } };
            expect(await usersHelp.getUserByToken(req)).to.be.equal(0);
        });

    });

    describe('Recipes', () => {

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
});