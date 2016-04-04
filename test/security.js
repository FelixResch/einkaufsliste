var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');

describe("Security", function () {
    var url = "http://localhost:3000";
    describe("Users", function () {
        it("Should deny the unauthorized access to the user list", function (done) {
            request(url)
                .get("/rest/users")
                .expect(401, done);
        });
        it("Should deny the unauthorized creation of a user", function (done) {
            request(url)
                .post("/rest/users")
                .expect(401, done);
        });
        it("Should deny the unauthorized creation of a user", function (done) {
            request(url)
                .post("/rest/users")
                .auth("test", "12345")
                .expect(401, done);
        });
        it("Should return the object _id of the user object", function (done) {
            request(url)
                .get('/rest/users/')
                .expect(200)
                .auth('root', '1a2b3c4d5e')
                .end(function (err, res) {
                    if(err)
                        throw err;
                    var obj = JSON.parse(res.text);
                    for(i = 0; i < obj.length; i++) {
                        obj[i].should.have.property('_id');
                        obj[i].should.not.have.property('password');
                        obj[i].should.have.property('username');
                        obj[i].should.have.property('email');
                        obj[i].should.have.property('role');
                    }
                    done();
                })
        });
        it("Should not return the object _id of the user object", function (done) {
            request(url)
                .get('/rest/users/')
                .expect(200)
                .auth('test', '12345')
                .end(function (err, res) {
                    if(err)
                        throw err;
                    var obj = JSON.parse(res.text);
                    for(i = 0; i < obj.length; i++) {
                        obj[i].should.not.have.property('_id');
                        obj[i].should.not.have.property('password');
                        obj[i].should.have.property('username');
                        obj[i].should.have.property('email');
                        obj[i].should.have.property('role');
                    }
                    done();
                })
        })
    });
    describe('Products', () => {
        it("Should deny the unauthorized access to the user list", function (done) {
            request(url)
                .get("/rest/products")
                .expect(401, done);
        });
        it("Should deny the unauthorized creation of a user", function (done) {
            request(url)
                .post("/rest/products")
                .expect(401, done);
        });
        it("Should return the user list", function (done) {
            request(url)
                .get("/rest/users")
                .auth('test', '12345')
                .expect(200, done);
        });
    })
});