exports.getPosts = (req, res) => {
    res.status(200).json({
        posts: [{
            title: "First Post",
            content: "This is the first post",
            createdAt: new Date(),
        }],
    });
};

exports.createPost = (req, res) => {
    const post = {
        id: new Date().toISOString(),
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date(),
    };
    res.status(201).json({
        message: "Post created successfully",
        post: {
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
        },
    });
};