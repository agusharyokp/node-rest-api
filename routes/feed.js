const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const feedController = require("../controllers/feed");

router.get("/posts", isAuth, feedController.getPosts);
router.post("/post",
    isAuth,
    [
        body("title")
            .trim()
            .isLength({ min: 5 }),
        body("content")
            .isLength({ min: 6 }),
    ],
    feedController.createPost
);

router.get("/post/:postId", isAuth, feedController.getPost);

router.put("/post/:postId", 
    [
        body("title")
            .trim()
            .isLength({ min: 5 }),
        body("content")
            .isLength({ min: 6 }),
    ],
    isAuth,
    feedController.updatePost);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
