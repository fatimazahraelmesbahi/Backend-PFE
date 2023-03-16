const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const multer = require("multer");
const upload = multer();

// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// user DB
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);


module.exports = router;
//deux web services pour une seul app 1 avec jEE et l'autre avec node js
//kayn call w kayn projet f anroid
//fl app aykon ya f node js ya f tomcat l cors 
//l api 
//client b ajax  node js //xml ou memoire //makaynch mongoose
//jsp attender tkon haja deff // authentification mtln 
//android ayrsmlina w y9olina le traitment
 