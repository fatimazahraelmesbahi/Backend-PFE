const mongoose = require('mongoose');
const {User} = require('./user.model');

const PostSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    picture: {
      type: String,
    },
    video: {
      type: String,
    },
    date_time: {
      type: Date,
      default: Date.now()
    },
    reactions: [new mongoose.Schema({
      type: String,
      enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry', 'care'],
      user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
    })],
    comments: [{
      content: String,
      date_time: {
        type: Date,
        default: Date.now()
      },
      user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      reactions: [new mongoose.Schema({
        type: String,
        enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry', 'care'],
        user: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }]
      })],
      sub_comments: [{
        content: String,
        user: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
          }],
          date_time: {
          type: Date,
          default: Date.now()
          },
        reactions: [new mongoose.Schema({
          type: String,
          enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry', 'care'],
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
        })]
      }]
    }]
  }
 
);
/* Kind of like a middleware function after creating our schema (since we have access to next) */
/* Must be a function declaration (not an arrow function), because we want to use 'this' to reference our schema */
const autoPopulateUser = function (next) {
  this.populate("user", "_id");
  this.populate("comments.user", "_id");
  this.populate("comments.sub_comments.user", "_id");
  next();
};


module.exports = mongoose.model('post', PostSchema);