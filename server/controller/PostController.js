const express = require("express");
const postService = require("../service/PostService");
const auth = require("../middleware/Auth");
const router = express.Router();

module.exports = router;