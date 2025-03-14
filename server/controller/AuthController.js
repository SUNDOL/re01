const express = require("express");
const authService = require("../service/AuthService");
const { resHandler } = require("../middleware/Res");
const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { atk, rtk } = await authService.login(email, password);
        res.cookie("rtk", rtk, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.setHeader("Authorization", `Bearer ${atk}`);
        return res.response(200, { atk });
    } catch (e) {
        return res.response(e.code);
    };
});

router.post("/logout", async (req, res) => {
    const { rtk } = req.cookies;
    if (!rtk) {
        return res.response(401);
    };
    try {
        await authService.logout(rtk);
        res.clearCookie("rtk");
        return res.response(200);
    } catch (e) {
        return res.response(e.code);
    };
});

module.exports = router;