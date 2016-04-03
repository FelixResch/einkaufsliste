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
        it("Request User", (done) => {
            request(url)
                .get("/rest/users/123456789")
                .expect(200)
                .auth("root", "1a2b3c4d5e")
                .end((err, res) => {
                    if(err)
                        throw err;
                    var obj = JSON.parse(res.text);
                    obj.should.have.property('username');
                    obj.username.should.equal('test_tests');
                    obj.should.have.property('email');
                    obj.email.should.equal('test@tests.at');
                    obj.should.have.property('role');
                    obj.role.should.equal('test');
                    obj.should.have.property('_id');
                    obj._id.should.equal('123456789');
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
        });
        it("Change the email of the user with an invalid email", (done) => {
            request(url)
                .put("/rest/users/123456789")
                .auth("root", "1a2b3c4d5e")
                .send({
                    "email":"This is not an email"
                })
                .set('Content-Type', 'application/json')
                .expect(400, done);
        });
        it("Delete the user", (done) => {
            request(url)
                .delete("/rest/users/123456789")
                .expect(200)
                .auth("root", "1a2b3c4d5e")
                .set("Content-Type", "application/json")
                .end((err, res) => {
                    if(err) {
                        throw err;
                    }
                    done();
                });
        })
    })
});