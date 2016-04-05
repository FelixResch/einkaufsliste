var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');

const url = "http://localhost:3000";

describe('Lists', () => {
    describe('CRUD', () => {
        it('Create a new empty list', (done) => {
            request(url)
                .post('/rest/lists')
                .auth('root', '1a2b3c4d5e')
                .set('Content-Type', 'application/json')
                .expect(200)
                .send({
                    timestamp: 10,
                    current: false,
                    _id: "1234567890",
                    items: []
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
        it('Change the timestamp of the new list (PUT)', (done) => {
            request(url)
                .put('/rest/lists/1234567890')
                .auth('root', '1a2b3c4d5e')
                .set('Content-Type', 'application/json')
                .expect(200)
                .send({
                    timestamp: 15
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
        it('Change the timestamp of the new list (PATCH)', (done) => {
            request(url)
                .patch('/rest/lists/1234567890')
                .auth('root', '1a2b3c4d5e')
                .set('Content-Type', 'application/json')
                .expect(200)
                .send({
                    timestamp: 20
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
        it('Fetch the list', (done) => {
            request(url)
                .get('/rest/lists/1234567890')
                .auth('root', '1a2b3c4d5e')
                .expect(200)
                .end((err, res) => {
                    if(err) {
                        throw err;
                    }
                    var obj = JSON.parse(res.text);
                    obj.should.have.property('timestamp');
                    obj.should.have.property('_id');
                    obj.timestamp.should.equal(20);
                    obj._id.should.equal("1234567890");
                    done();
                })
        });
        it('Delete the list', (done) => {
            request(url)
                .delete('/rest/lists/1234567890')
                .auth('root', '1a2b3c4d5e')
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
                })
        })

    });
    describe('Test List Operations', (done) => {
        
    })
});