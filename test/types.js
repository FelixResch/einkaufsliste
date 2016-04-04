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
    });
    describe('Products', () => {
        var Product = types.product;
        it('Correct product', () => {
            assert(validate.check({
                display: 'Cola (2l)',
                ean13: '123456789'
            }, Product), "Valid product")
        });
        it('Product with additional field', () => {
            assert(!validate.check({
                display: 'Cola (2l)',
                ean13: '123456789',
                minPrice: 1.24
            }, Product), "Product should not be valid")
        });
        it('Product with missing field', () => {
            assert(!validate.check({
                display: 'Cola (2l)'
            }, Product), "Product should not be valid")
        });
        it('Product with optional field', () => {
            assert(validate.check({
                display: 'Cola (2l)',
                ean13: '123456798',
                _id: '1234567980'
            }, Product), "Product should not be valid")
        })
    });
    describe('Lists', () => {
        var List = types.list;
        it('Correct empty list', () => {
            assert(validate.check({
                current: false,
                timestamp: 10,
                items: []
            }, List), 'Valid empty list')
        });
        it('Correct list with items', () => {
            assert(validate.check({
                current: false,
                timestamp: 10,
                items: [
                    {
                        display: 'Cola (2l)',
                        _id: '123456789',
                        added: 15,
                        amount: 2
                    },
                    {
                        display: 'Cola (0.5l)',
                        _id: '123456789',
                        added: 18,
                        amount: 4
                    }
                ]
            }, List), 'Valid list with items')
        });
        it('List with invalid entry', () => {
            assert(!validate.check({
                current: false,
                timestamp: 10,
                items: [
                    {
                        display: 'Cola (2l)',
                        _id: '123456789',
                        added: 15
                    },
                    {
                        display: 'Cola (0.5l)',
                        _id: '123456789',
                        added: 18,
                        amount: 4
                    }
                ]
            }, List), 'List with invalid item')
        })
    })
});