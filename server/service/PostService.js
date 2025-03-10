const Post = require('../model/Post');

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: "Create a new post"
 *     description: "This endpoint allows you to create a new post with a title and content."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Post"
 *               content:
 *                 type: string
 *                 example: "This is a new post content."
 *     responses:
 *       201:
 *         description: "Post created successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "New Post"
 *                 content:
 *                   type: string
 *                   example: "This is a new post content."
 *       500:
 *         description: "Internal server error"
 */
const createPost = async (req, res) => {
    const { title, content } = req.body;
    try {
        const post = await Post.create({ title, content });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPost,
};