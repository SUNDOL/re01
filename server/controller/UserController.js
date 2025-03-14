const express = require("express");
const userService = require("../service/UserService");
const { authMiddleware } = require("../middleware/Auth");
const { resHandler } = require("../middleware/Res");
const router = express.Router();

router.post("/", async (req, res) => {
    const { email, password, nickname } = req.body;
    try {
        const info = await userService.createUser(email, password, nickname);
        return res.response(201, info);
    } catch (e) {
        return res.response(e.code);
    };
});

router.get("/", authMiddleware, async (req, res) => {
    const { id } = req.user;
    try {
        const info = await userService.readUser(id);
        return res.response(200, info);
    } catch (e) {
        return res.response(e.code);
    };
});

router.put("/", authMiddleware, async (req, res) => {
    const { id } = req.user;
    const { nickname } = req.body;
    try {
        const info = await userService.updateUser(id, nickname);
        return res.response(200, info);
    } catch (e) {
        return res.response(e.code);
    };
});

router.get("/echeck/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const check = await userService.emailCheck(email);
        return res.response(200, check);
    } catch (e) {
        return res.response(e.code);
    };
});

router.get("/ncheck/:nickname", async (req, res) => {
    const { nickname } = req.params;
    try {
        const check = await userService.nicknameCheck(nickname);
        return res.response(200, check);
    } catch (e) {
        return res.response(e.code);
    };
});

router.put("/pw", authMiddleware, async (req, res) => {
    const { id } = req.user;
    const { currentPw, newPw } = req.body;
    try {
        await userService.updatePassword(id, currentPw, newPw);
        return res.response(200);
    } catch (e) {
        return res.response(e.code);
    };
});

module.exports = router;