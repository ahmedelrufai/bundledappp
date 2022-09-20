const router = require("express").Router();
const userCtrl = require("../controller/userController");
const auth = require("../../middleware/auth");

router.post("/user/register", userCtrl.register);

router.get("/refresh_token", userCtrl.refreshToken);

router.post("/user/login", userCtrl.login);
router.get("/user/logout", userCtrl.logout);
router.get("/user/get-categories", userCtrl.getAllCategories);

router.get("/user/verify-email", userCtrl.verifyUser);
router.post("/user/visitors",userCtrl.addVisitor)

router.get("/user/success", userCtrl.success);
router.post("/user/create-blog",userCtrl.createBlog)
router.post("/user/blogs/",userCtrl.getAllBlogs)

router.post("/user/create-blog-category",userCtrl.createBlogCategory)
router.post("/user/add-blog-editor",userCtrl.addBlogEditor);
router.post("/user/get-blog-editors",userCtrl.blogEditors);

router.get("/allusers", userCtrl.getusers);
router.get("/allcvs", userCtrl.getcvs);
router.get("/allletters", userCtrl.getletters);

router.delete("/user/delete/:id", userCtrl.delete);

module.exports = router;
