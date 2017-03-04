console.log("Test Started");

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../app');
const should = chai.should();
chai.use(chaiHttp);


describe('Shopping List', function() {

  before(function() {
    return runServer(); 
  });

  after(function() {
    return closeServer();
  });

  it('should list of all items on GET', function() {
    return chai.request(app)
      .get('/posts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        const expectedKeys = ['author', 'content', 'id', 'publishDate', 'title'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should add an item on POST', function() {
    const newItem = {title: 'Test title', content: 'Test content', author: 'Test author'};
    return chai.request(app)
      .post('/posts')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.publishDate.should.not.be.NaN;
        const expectedKeys = ['author', 'content', 'id', 'publishDate', 'title'];
        res.body.should.include.keys(expectedKeys);
      });
  });

  it('should list specific poston GET/id', function() {
    return chai.request(app)
      .get('/posts/')
      .then(function(res) {
        return chai.request(app)
          .get(`/posts/${res.body[0].id}`)
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        const expectedKeys = ['author', 'content', 'id', 'publishDate', 'title'];
        res.body.should.include.keys(expectedKeys);
      });
  });

  it('should update items on PUT', function() {
    const updateData = {
      author: 'Updated author',
      content: 'Updated content',
      title: 'Updated title',
      publishDate: Date.now()
    };
    return chai.request(app)
      .get('/posts')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/posts/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal(updateData);
      });
  });

  it('should delete post on DELETE', function() {
    return chai.request(app)
      .get('/posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/posts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});