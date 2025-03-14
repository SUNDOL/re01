const express = require("express");
const postService = require("../service/PostService");
const { authMiddleware, optionalAuthMiddleware } = require("../middleware/Auth");
const { resHandler } = require("../middleware/Res");
const router = express.Router();

router.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const { totalPosts, posts } = await postService.listPost(page, limit);
        return res.response(200, { totalPosts, posts });
    } catch (e) {
        return res.response(e.code);
    };
});

router.post("/", authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const { id } = req.user;
    try {
        const data = await postService.createPost({ id, title, content });
        return res.response(201, data);
    } catch (e) {
        return res.response(e.code);
    };
});

router.get("/:id", optionalAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const uId = req.user ? req.user.id : null;
    try {
        const data = await postService.readPost(id, uId);
        if (!data) {
            return res.response(404);
        };
        return res.response(200, data);
    } catch (e) {
        return res.response(e.code);
    };
});

router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const uId = req.user.id;
    try {
        const data = await postService.updatePost(id, uId, { title, content });
        return res.response(200, data);
    } catch (e) {
        return res.response(e.code);
    };
});

module.exports = router;