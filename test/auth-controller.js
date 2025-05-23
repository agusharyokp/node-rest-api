const authController = require('../controllers/auth');
const User = require('../models/user');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('Auth Controller - Login', function() {
    it('should throw an error with a 500 status code if accessing the database fails', function() {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'test'
            }
        };

        authController.login(req, {}, () => {}).then((result) => {
            expect(result).to.be.instanceOf(Error);
            expect(result).to.have.property('statusCode', 500);
            done();
        });

        User.findOne.restore();
    });
});
