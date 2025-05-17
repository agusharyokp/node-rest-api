const { validationResult } = require("express-validator");
const Post = require("../models/post");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;

    Post.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            res.status(200).json({
                posts: posts,
                message: "Posts fetched successfully",
                totalItems: totalItems,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createPost = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }

    const userId = req.userId;

    let creator;
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.file.path,
        creator: userId,
    });

    post.save()
        .then(result => {
            return User.findById(userId);
        })
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Post Created",
                post: post,
                creator: { _id: creator._id, name: creator.name },
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: "Post fetched successfully", post: post });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not authorized');
                error.statusCode = 403;
                throw error;
            }
            if (post.imageUrl !== imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;
            return post.save();
        })
        .then(result => {
            res.status(200).json({ message: "Post updated successfully", post: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not authorized');
                error.statusCode = 403;
                throw error;
            }

            clearImage(post.imageUrl);
            return Post.deleteOne({ _id: postId });
        })
        .then((post) => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: "Post deleted successfully" });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

const clearImage = filePath => {
    console.log(filePath);
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        console.log(err);
    });
};