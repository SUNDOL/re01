const express = require("express");
const postService = require("../service/PostService");

const router = express.Router();

router.post("/", postService.createPost);

module.exports = router;