const express = require("express");
const userService = require("../service/UserService");
const { authMiddleware } = require("../middleware/Auth");
const { resHandler } = require("../middleware/Res");
const router = express.Router();

router.post("/", async (req, res) => {
    const { email, password, nickname } = req.body;
    try {
        const data = await userService.createUser(email, password, nickname);
        return res.response(201, data);
    } catch (e) {
        return res.response(e.code);
    };
});

router.get("/", authMiddleware, async (req, res) => {
    const { id } = req.user;
    try {
        const data = await userService.readUser(id);
        return res.response(200, data);
    } catch (e) {
        return res.response(e.code);
    };
});

router.put("/", authMiddleware, async (req, res) => {
    const { id } = req.user;
    const { nickname } = req.body;
    try {
        const data = await userService.updateUser(id, nickname);
        return res.response(200, data);
    } catch (e) {
        return res.response(e.code);
    };
});

router.delete("/", authMiddleware, async (req, res)=> {
    try {
      const { id } = req.user;
      const data = await userService.deleteUser(id);
      if (data) {
        res.clearCookie("rtk");
        return res.response(200);
      };
    } catch (e) {
        return res.response(e.code);
    };
});

router.get("/echeck/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const data = await userService.emailCheck(email);
        return res.response(200, data);
    } catch (e) {
        return res.response(e.code);
    };
});

router.get("/ncheck/:nickname", async (req, res) => {
    const { nickname } = req.params;
    try {
        const data = await userService.nicknameCheck(nickname);
        return res.response(200, data);
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