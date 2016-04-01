var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');

const url = "http://localhost:3000";

describe("Users", () => {
    describe("CRUD", () => {
        it("Create a User", (done) => {
            request(url)
                .post("/rest/users")
                .expect(200)
                .auth("root", "1a2b3c4d5e")
                .send({
                    "username":"test_tests",
                    "password":"test",
                    "email":"test@tests.at",
                    "role":"test",
                    "_id":"123456789"
                })
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    if(err)
                        throw err;
                    var obj = JSON.parse(res.text);
                    obj.should.have.property('ok');
                    obj.ok.should.equal(1);
                    obj.should.have.property('n');
                    obj.n.should.equal(1);
                    done();
                });
        });
        it("Change the email of the user (PATCH)", (done) => {
            request(url)
                .patch("/rest/users/123456789")
                .expect(200)
                .auth("root", "1a2b3c4d5e")
                .send({
                    "email":"test.test@tests.at"
                })
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    if(err)
                        throw err;
                    var obj = JSON.parse(res.text);
                    obj.should.have.property('ok');
                    obj.ok.should.equal(1);
                    obj.should.have.property('n');
                    obj.n.should.equal(1);
                    done();
                });
        });
        it("Change the email of the user (PUT)", (done) => {
            request(url)
                .put("/rest/users/123456789")
                .expect(200)
                .auth("root", "1a2b3c4d5e")
                .send({
                    "email":"test.test2@tests.at"
                })
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    if(err)
                        throw err;
                    var obj = JSON.parse(res.text);
                    obj.should.have.property('ok');
                    obj.ok.should.equal(1);
                    obj.should.have.property('n');
                    obj.n.should.equal(1);
                    done();
                });
        })
    })
});