const Post = require('../models/Post');

const CreatePost = async (req, res) => {
    const {title, content} = req.body;
    try {
        const post = await Post.create({ title, content });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const ReadPost = async (req, res) => {
    try {
        const posts = await post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    CreatePost,
    ReadPost,
}