var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');

const url = "http://localhost:3000";

describe("Products", () => {
    describe("CRUD", () => {
        it("Create valid product", (done) => {
            request(url)
                .post('/rest/products/')
                .auth('root', '1a2b3c4d5e')
                .set('Content-Type', 'application/json')
                .expect(200)
                .send({
                    display: 'Cola (2l)',
                    ean13: '1234567890',
                    _id: '1234567890'
                })
                .end((err, res) => {
                    if(err) {
                        throw err;
                    }
                    var obj = JSON.parse(res.text);
                    obj.should.have.property('ok');
                    obj.ok.should.equal(1);
                    obj.should.have.property('n');
                    obj.n.should.equal(1);
                    done();
                })
        });
        it("Create invalid product", (done) => {
            request(url)
                .post('/rest/products')
                .auth('root', '1a2b3c4d5e')
                .set('Content-Type', 'application/json')
                .expect(400)
                .send({
                    display: 'Cola (0.5l)'
                })
                .end(done);
        });
        it("Change products ean (PUT)", (done) => {
            request(url)
                .put('/rest/products/1234567890')
                .auth('root', '1a2b3c4d5e')
                .set('Content-Type', 'application/json')
                .expect(200)
                .send({
                    ean13: '5678901234'
                })
                .end((err, res) => {
                    if(err) {
                        throw err;
                    }
                    var obj = JSON.parse(res.text);
                    obj.should.have.property('ok');
                    obj.ok.should.equal(1);
                    obj.should.have.property('n');
                    obj.n.should.equal(1);
                    done();
                });
        });
        it("Change products ean (PATCH)", (done) => {
            request(url)
                .patch('/rest/products/1234567890')
                .auth('root', '1a2b3c4d5e')
                .set('Content-Type', 'application/json')
                .expect(200)
                .send({
                    ean13: '1234567890'
                })
                .end((err, res) => {
                    if(err) {
                        throw err;
                    }
                    var obj = JSON.parse(res.text);
                    obj.should.have.property('ok');
                    obj.ok.should.equal(1);
                    obj.should.have.property('n');
                    obj.n.should.equal(1);
                    done();
                });
        });
        it("Delete Product", (done) => {
            request(url)
                .delete('/rest/products/1234567890')
                .auth('root', '1a2b3c4d5e')
                .set('Content-Type', 'application/json')
                .expect(200)
                .end((err, res) => {
                    if(err) {
                        throw err;
                    }
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