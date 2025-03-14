const express = require("express");
const userService = require("../service/UserService");
const { authMiddleware } = require("../middleware/Auth");
const router = express.Router();

router.post("/", async (req, res) => {
    const { email, password, nickname } = req.body;
    try {
        const info = await userService.createUser(email, password, nickname);
        return res.status(201).json({ msg: "회원가입 성공.", data: { id: info.uId, email: info.uEmail, nickname: info.uNickname } });
    } catch (e) {
        return res.status(e.status || 500).json({ msg: e.msg || "서버 오류." });
    };
});

router.get("/", authMiddleware, async (req, res) => {
    const { id } = req.user;
    try {
        const info = await userService.readUser(id);
        if (!info) {
            return res.status(404).json({ msg: "사용자를 찾을 수 없음." });
        } else {
            return res.status(200).json({ msg: "회원정보 조회 성공.", data: info });
        };
    } catch (e) {
        return res.status(500).json({ msg: "서버 오류." });
    };
});

router.put("/", authMiddleware, async (req, res) => {
    const { id } = req.user;
    const { nickname } = req.body;
    try {
        const info = await userService.updateUser(id, nickname);
        return res.status(200).json({ msg: "회원 정보 수정 성공.", data: info });
    } catch (e) {
        return res.status(e.status || 500).json({ msg: e.msg || "서버 오류." });
    };
});

router.get("/echeck/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const check = await userService.emailCheck(email);
        return res.status(200).json({ msg: check ? "이메일 사용 가능." : "이메일 사용 불가능." });
    } catch (e) {
        return res.status(500).json({ msg: "서버 오류." });
    };
});

router.get("/ncheck/:nickname", async (req, res) => {
    const { nickname } = req.params;
    try {
        const check = await userService.nicknameCheck(nickname);
        return res.status(200).json({ msg: check ? "닉네임 사용 가능." : "닉네임 사용 불가." });
    } catch (e) {
        return res.status(500).json({ msg: "서버 오류." });
    };
});

router.put("/pw", authMiddleware, async (req, res) => {
    const { id } = req.user;
    const { currentPw, newPw } = req.body;
    try {
        console.log("Controller 1")
        await userService.updatePassword(id, currentPw, newPw);
        return res.status(200).json({ msg: "패스워드 변경 성공." });
    } catch (e) {
        return res.status(e.status || 500).json({ msg: e.msg || "서버 오류." });
    };
});

module.exports = router;