const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const checkUser = require("../middleware/auth.middleware")
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);


module.exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            comments: {
              content: req.body.content,
              user: req.user.id,
              reactions: [],
              sub_comments: []
            },
          },
        },
        { new: true },
        (err, docs) => {
          if (!err) return res.send(docs);
          else return res.status(400).send(err);
        }
      );
    } catch (err) {
      return res.status(400).send(err);
    }
  };
  
  module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return PostModel.findById(req.params.id, (err, docs) => {
        const theComment = docs.comments.find((comment) =>
          comment._id.equals(req.body.commentId)
        );
  
        if (!theComment) return res.status(404).send("Comment not found");
        theComment.content = req.body.content;
  
        return docs.save((err) => {
          if (!err) return res.status(200).send(docs);
          return res.status(500).send(err);
        });
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  };
  
  module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            comments: {
              _id: req.body.commentId,
            },
          },
        },
        { new: true })
              .then((data) => res.send(data))
              .catch((err) => res.status(500).send({ message: err }));
      } catch (err) {
          return res.status(400).send(err);
      }
  };
  
  
  module.exports.reactionComment = async (req, res) => {
    const { type } = req.body;
    if (!ObjectID.isValid(req.params.id) )
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      const post = await PostModel.findById(req.params.id);
      const comment = post.comments.id(req.body.commentId);
  
      if (!comment) return res.status(404).send("Comment not found");
  
      const reaction = comment.reactions.find((r) => r.user.toString() === req.user.id);
  
      if (reaction) {
        reaction.type = type;
      } else {
        comment.reactions.push({ type, user: req.user.id });
      }
  
      await post.save();
  
      res.send(post);
    } catch (err) {
      return res.status(400).send(err);
    }
  };
  
module.exports.deletereactionComment = async (req, res) => {
    
        if (!ObjectID.isValid(req.params.id))
          return res.status(400).send("ID unknown : " + req.params.id);
      
        try {
          const post = await PostModel.findById(req.params.id);
          const comment = post.comments.id(req.body.commentId);
      
          if (!comment) return res.status(404).send("Comment not found");
      
          const reactionIndex = comment.reactions.findIndex((r) => r.user.toString() === req.user.id);
      
          if (reactionIndex === -1) {
            return res.status(404).send("Reaction not found");
          } else {
            comment.reactions.splice(reactionIndex, 1);
          }
      
          await post.save();
      
          res.send(post);
        } catch (err) {
          return res.status(400).send(err);
        }
      
};
  