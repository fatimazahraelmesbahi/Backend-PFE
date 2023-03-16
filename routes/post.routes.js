const router = require('express').Router();
const postController = require('../controllers/post.controller');
const commentController = require('../controllers/comment.controller');
const subcommentsController =require('../controllers/subComment.controller')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const uploadDir = `uploads/${year}/${month}/${day}/`;
  
      // Create the directory if it doesn't exist
      const dir = path.resolve(uploadDir);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
  
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const extension = path.extname(file.originalname);
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      cb(null, timestamp + extension); // set the filename to the current date and time with the original extension
    }
  });
  const upload = multer({
    storage,
    limits: { fileSize: 75 * 1024 * 1024 }, // set the maximum file size to 75 MB
  
  });
router.get('/', postController.readPost);
router.post('/', upload.single("file"), postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

//reactions
router.post('/reaction-post/:id', postController.reactionPost);
router.delete('/delete-reaction-post/:id', postController.deletereactionPost);

router.post('/reaction-comment/:id', commentController.reactionComment);
router.delete('/delete-reaction-comment/:id', commentController.deletereactionComment);


router.post('/reaction-subcomment/:id', subcommentsController.reactionsubComment);
router.delete('/delete-reaction-subcomment/:id', subcommentsController.deletereactionsubComment);

// comments
router.post('/comment-post/:id', commentController.commentPost);
router.patch('/edit-comment-post/:id', commentController.editCommentPost);
router.delete('/delete-comment-post/:id', commentController.deleteCommentPost);

// subcomments
router.post('/subcomment-post/:id', subcommentsController.subCommentPost);
router.patch('/edit-subcomment-post/:id', subcommentsController.editsubCommentPost);
router.delete('/delete-subcomment-post/:id', subcommentsController.deletesubCommentPost);

module.exports = router;