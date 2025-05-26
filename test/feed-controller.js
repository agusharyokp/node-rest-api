const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post'); 
const FeedController = require('../controllers/feed');

describe('Feed Controller', function() {
  before(function(done) {
    this.timeout(20000); // 10 seconds

    mongoose
    .connect(
      'mongodb+srv://haryo:-Password123@cluster0.zpxx6bn.mongodb.net/testcode?retryWrites=true'
    )
    .then(result => {
      const user = new User({
        email: 'test@test.com',
        password: 'tester',
        name: 'Test',
        posts: [],
        status: 'I am new!',
        _id: '5c0f66b979af55031b34728a'
      });
      return user.save();
    })
    .then(() => {
      done();
    })
    .catch(err => {
      console.error('Error in before hook:', err);
      done(err);
    });
  });

  beforeEach(function() {});

  afterEach(function() {});

  it('should add a created post to the posts of the creator', function(done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'Test Content',
      },
      file: {
        path: 'test.jpg'
      },
      userId: '5c0f66b979af55031b34728a'
    };

    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };
  
    FeedController.createPost(req, res, () => {}).then((savedUser) => {
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.lengthOf(1);
        done();
    });
  });


  after(function(done) {
    Post.deleteMany({})
      .then(() => {
        return User.deleteMany({});
      })
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
