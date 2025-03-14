const express = require("express");
const postService = require("../service/PostService");
const { authMiddleware } = require("../middleware/Auth");
const { resHandler } = require("../middleware/Res");
const router = express.Router();

router.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const { totalPosts, posts } = await postService.listPost(page, limit);
        return res.response(200, { totalPosts, posts });
    } catch (e) {
        return res.response(500);
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

router.put("/", async (req, res) => {

});

router.get("/:id", async (req, res) => {

});

module.exports = router;