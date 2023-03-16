const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const checkUser = require("../middleware/auth.middleware")
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

module.exports.subCommentPost =async (req, res) => {
   
    
    if (!ObjectID.isValid(req.params.id) )
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      const post = await PostModel.findById(req.params.id);
      const comment = post.comments.id(req.body.commentId);
  
      if (!comment) return res.status(404).send("Comment not found");
  
      const sub_comments = comment.sub_comments.find((c) => c.user.toString() === req.user.id);
  
      if (sub_comments) {
        sub_comments.content = req.body.content;
      } else {
        comment.sub_comments.push({ content:req.body.content, user: req.user.id });
      }
  
      await post.save();
  
      res.send(post);
    } catch (err) {
      return res.status(400).send(err);
    }
  };

module.exports.editsubCommentPost =async (req, res) => {
    

    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      const post = await PostModel.findById(req.params.id);
      const comment = post.comments.id(req.body.commentId);
      const subComment = comment.sub_comments.id(req.body.subCommentId);
  
      if (!comment) return res.status(404).send("Comment not found");
  
      if (!subComment) return res.status(404).send("Sub-comment not found");
  
      subComment.content = req.body.content;
  
      await post.save();
  
      res.send(post);
    } catch (err) {
      return res.status(400).send(err);
    }
};
  
module.exports.deletesubCommentPost =async (req, res) => {
        if (!ObjectID.isValid(req.params.id))
          return res.status(400).send("ID unknown : " + req.params.id);
      
        try {
          const post = await PostModel.findById(req.params.id);
          const comment = post.comments.id(req.body.commentId);
          const subComment = comment.sub_comments.id(req.body.subCommentId);
      
          if (!comment) return res.status(404).send("Comment not found");
      
          if (!subComment) return res.status(404).send("Sub-comment not found");
      
          subComment.remove();
      
          await post.save();
      
          res.send(post);
        } catch (err) {
          return res.status(400).send(err);
        }
      
      
};
  
  
module.exports.reactionsubComment = async (req, res) => {
        const { type } = req.body;
        if (!ObjectID.isValid(req.params.id))
          return res.status(400).send("ID unknown : " + req.params.id);
      
        try {
          const post = await PostModel.findById(req.params.id);
          const comment = post.comments.id(req.body.commentId);
          const subComment = comment.sub_comments.id(req.body.subCommentId);
      
          if (!comment) return res.status(404).send("Comment not found");
      
          if (!subComment) return res.status(404).send("Sub-comment not found");
      
          const reaction = subComment.reactions.find((r) => r.user.toString() === req.user.id);
      
          if (reaction) {
            reaction.type = type;
          } else {
            subComment.reactions.push({ type, user: req.user.id });
          }
      
          await post.save();
      
          res.send(post);
        } catch (err) {
          return res.status(400).send(err);
        }
      
};
  
module.exports.deletereactionsubComment = async (req, res) => {

        if (!ObjectID.isValid(req.params.id))
          return res.status(400).send("ID unknown : " + req.params.id);
      
        try {
          const post = await PostModel.findById(req.params.id);
          const comment = post.comments.id(req.body.commentId);
          const subComment = comment.sub_comments.id(req.body.subCommentId);
      
          if (!comment) return res.status(404).send("Comment not found");
      
          if (!subComment) return res.status(404).send("Sub-comment not found");
      
          const reactionIndex = subComment.reactions.findIndex((r) => r.user.toString() === req.user.id);
      
          if (reactionIndex === -1) {
            return res.status(404).send("Reaction not found");
          } else {
            subComment.reactions.splice(reactionIndex, 1);
          }
      
          await post.save();
      
          res.send(post);
        } catch (err) {
          return res.status(400).send(err);
        }
};
      
  