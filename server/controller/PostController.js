const express = require("express");
const postService = require("../service/PostService");
const auth = require("../middleware/Auth");
const { resHandler } = require("../middleware/Res");
const router = express.Router();

router.get("/", async (req, res) => {

});

router.post("/", async (req, res) => {

});

router.put("/", async (req, res) => {

});

module.exports = router;