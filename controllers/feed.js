const { validationResult } = require("express-validator");
const Post = require("../models/post");
const fs = require("fs");
const path = require("path");

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

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.file.path,
        creator: {
            name: "Haryo"
        },
    });

    post.save()
        .then(result => {
            res.status(201).json({
                message: "Post created successfully",
                post: {
                    id: result._id,
                    title: result.title,
                    content: result.content,
                    createdAt: result.createdAt,
                    imageUrl: result.imageUrl,
                    creator: {
                        name: "Haryo",
                        avatar: "images/IGM.jpg",
                    },
                },
            });
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
            return Post.deleteOne({ _id: postId });
        })
        .then((post) => {
            clearImage(post.imageUrl);
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