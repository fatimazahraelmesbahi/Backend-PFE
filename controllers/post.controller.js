const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const checkUser = require("../middleware/auth.middleware")
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);



module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};

module.exports.createPost = async (req, res) => {

  console.log(req.file);
  
  const newPost = new postModel({
    posterId: req.user.id,
    content: req.body.content,
    //picture: req.file !== null ? "./uploads/posts/" + fileName : "",
    video: req.body.video,
    reactions: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
};


module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    content: req.body.content,
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};

module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error : " + err);
  });
};
module.exports.reactionPost = async (req, res) => {
  const { type } = req.body;
  if (!ObjectID.isValid(req.params.id))

    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { reactions: {type,user:req.user.id} },
      },
      { new: true })
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.deletereactionPost = async (req, res) => {
  const { type } = req.body;
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { reactions: {type,user:req.user.id} },
      },
      { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};
