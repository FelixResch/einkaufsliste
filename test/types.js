var should = require('should');
var assert = require('assert');
var winston = require('winston');
var types = require('../types');
var validate = require('../objectValidator');

describe('Types', () => {
    describe('User', () => {
        var User = types.user;
        it('Correct user', () => {
            assert(validate.check({
                username: 'test',
                email: 'test@testmail.com',
                password: '1234',
                role: 'testuser',
                display: 'Test'
            }, User), 'User should have been valid')
        });
        it('User with additional field', () => {
            assert(!validate.check({
                username: 'test',
                email: 'test@testmail.com',
                password: '1234',
                role: 'testuser',
                display: 'Test',
                svn: "123456789"
            }, User), 'User should not be valid')
        });
        it('User with missing field', () => {
            assert(!validate.check({
                username: 'test',
                email: 'test@testmail.com',
                password: '1234',
                display: 'Test'
            }, User), 'User should not be valid')
        });
        it('User with wrong email', () => {
            assert(!validate.check({
                username: 'test',
                email: 'This is not an email',
                password: '1234',
                role: 'testuser',
                display: 'Test'
            }, User), 'User should not be valid')
        });
        it('User with missing optional field', () => {
            assert(validate.check({
                username: 'test',
                email: 'test@testmail.com',
                password: '1234',
                role: 'testuser'
            }, User), 'User should have been valid')
        });
        it('Update user with wrong email', () => {
            assert(!validate.update({email: "This is not an email"}, User), "User should not be valid");
        });
        it('Update user with wrong field', () => {
            assert(!validate.update({svn: "123456789"}, User), "User should not be valid");
        })
    })
});