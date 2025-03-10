/**
 * @swagger
 * tags:
 *   - name: Post
 *     description: Post 관련 API
 */

const express = require("express");
const postService = require("../service/PostService");

const router = express.Router();

router.post("/", postService.createPost);

module.exports = router;