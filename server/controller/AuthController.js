const express = require("express");
const authService = require("../service/AuthService");
const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { atk, rtk } = await authService.login(email, password);
        return res.status(200).json({ msg: "로그인 성공.", atk, rtk });
    } catch (e) {
        return res.status(e.status || 500).json({ msg: e.msg || "서버 오류." });
    };
});

router.post("/logout", async (req, res) => {
    const { rtk } = req.body;
    try {
        await authService.logout(rtk);
        return res.status(200).json({ msg: "로그아웃 성공." });
    } catch (e) {
        return res.status(e.status || 500).json({ msg: e.msg || "서버 오류." });
    };
});

module.exports = router;