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
    describe('Test List Operations', () => {
        it('Create Test List', (done) => {
            request(url)
                .post('/rest/lists/new')
                .auth('root', '1a2b3c4d5e')
                .set('Content-Type', 'application/json')
                .send({_id: "123456789"})
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
        });
        it('Create a test product', (done) => {
            request(url)
                .post('/rest/products/')
                .auth('root', '1a2b3c4d5e')
                .set('Content-Type', 'application/json')
                .expect(200)
                .send({
                    display: 'Cola (2l)',
                    ean13: '123456789',
                    _id: '123456789'
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
        it('Add one test product (PUT)', (done) => {
            request(url)
                .put('/rest/lists/current/123456789')
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
                    request(url)
                        .get('/rest/lists/current')
                        .auth('root', '1a2b3c4d5e')
                        .expect(200)
                        .end((err, res) => {
                            if(err) {
                                throw err;
                            }
                            var obj = JSON.parse(res.text);
                            obj.should.have.property('items');
                            obj.items.length.should.equal(1);
                            obj.items[0].should.have.property('display');
                            obj.items[0].display.should.equal('Cola (2l)');
                            obj.items[0].should.have.property('amount');
                            obj.items[0].amount.should.equal(1);
                            obj.items[0].should.have.property('_id');
                            obj.items[0]._id.should.equal('123456789');
                            obj.items[0].should.have.property('added');
                            done();
                        })
                })
        });
        it('Remove one test product', (done) => {
            request(url)
                .delete('/rest/lists/current/123456789')
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
                    request(url)
                        .get('/rest/lists/current')
                        .auth('root', '1a2b3c4d5e')
                        .expect(200)
                        .end((err, res) => {
                            if(err) {
                                throw err;
                            }
                            var obj = JSON.parse(res.text);
                            obj.should.have.property('items');
                            obj.items.length.should.equal(0);
                            done();
                        })
                })
        });
        it('Add one test product twice (PATCH)', (done) => {
            request(url)
                .patch('/rest/lists/current/123456789')
                .auth('root', '1a2b3c4d5e')
                .set('Content-Type', 'application/json')
                .expect(200)
                .send({
                    amount: 2
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
                    request(url)
                        .get('/rest/lists/current')
                        .auth('root', '1a2b3c4d5e')
                        .expect(200)
                        .end((err, res) => {
                            if(err) {
                                throw err;
                            }
                            var obj = JSON.parse(res.text);
                            obj.should.have.property('items');
                            obj.items.length.should.equal(1);
                            obj.items[0].should.have.property('display');
                            obj.items[0].display.should.equal('Cola (2l)');
                            obj.items[0].should.have.property('amount');
                            obj.items[0].amount.should.equal(2);
                            obj.items[0].should.have.property('_id');
                            obj.items[0]._id.should.equal('123456789');
                            obj.items[0].should.have.property('added');
                            done();
                        })
                })
        });
        it('Add one test product again', (done) => {
            request(url)
                .patch('/rest/lists/current/123456789')
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
                    request(url)
                        .get('/rest/lists/current')
                        .auth('root', '1a2b3c4d5e')
                        .expect(200)
                        .end((err, res) => {
                            if(err) {
                                throw err;
                            }
                            var obj = JSON.parse(res.text);
                            obj.should.have.property('items');
                            obj.items.length.should.equal(1);
                            obj.items[0].should.have.property('display');
                            obj.items[0].display.should.equal('Cola (2l)');
                            obj.items[0].should.have.property('amount');
                            obj.items[0].amount.should.equal(3);
                            obj.items[0].should.have.property('_id');
                            obj.items[0]._id.should.equal('123456789');
                            obj.items[0].should.have.property('added');
                            done();
                        })
                })
        });
        it('Delete test list', (done) => {
            request(url)
                .delete('/rest/lists/123456789')
                .auth('root', '1a2b3c4d5e')
                .expect(200)
                .end((err, res) => {
                    if(err) {
                        console.log(res.text);
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
        it('Delete test product', (done) => {
            request(url)
                .delete('/rest/products/123456789')
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
    })
});