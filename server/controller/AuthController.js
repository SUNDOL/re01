const express = require("express");
const authService = require("../service/AuthService");
const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { atk, rtk } = await authService.login(email, password);
        res.cookie("rtk", rtk, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ msg: "로그인 성공.", atk });
    } catch (e) {
        return res.status(e.status || 500).json({ msg: e.msg || "서버 오류." });
    };
});

router.post("/logout", async (req, res) => {
    const { rtk } = req.cookies;
    if (!rtk) {
        return res.status(400).json({ msg: "로그인 상태가 아님." });
    };
    try {
        await authService.logout(rtk);
        res.clearCookie("rtk");
        return res.status(200).json({ msg: "로그아웃 성공." });
    } catch (e) {
        return res.status(e.status || 500).json({ msg: e.msg || "서버 오류." });
    };
});

module.exports = router;