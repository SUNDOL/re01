const jwt = require("jsonwebtoken");
const { User } = require("../model/User");
require("dotenv").config();

const refreshAccessToken = async (req, res, next) => {
    try {
        const { rtk } = req.cookies;
        if (!rtk) {
            return res.status(401).json({ msg: "리프레시 토큰이 필요함." });
        };
        const decoded = jwt.verify(rtk, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ msg: "유효하지 않은 Refresh Token임." });
        };
        const newAccessToken = jwt.sign(
            { id: user.uId, email: user.uEmail },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
        );
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        req.user = { id: user.uId, email: user.uEmail };
        next();
    } catch (e) {
        return res.status(401).json({ msg: "Refresh Token 검증 실패." });
    };
};

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "액세스 거부됨. Access Token이 필요함." });
    };
    const aToken = authorization.split(" ")[1];
    try {
        const dec1 = jwt.verify(aToken, process.env.JWT_ACCESS_SECRET);
        req.user = { id: dec1.id, email: dec1.email };
        return next();
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            return refreshAccessToken(req, res, next);
        };
        return res.status(401).json({ msg: "유효하지 않은 Access Token임." });
    };
};

module.exports = { authMiddleware, refreshAccessToken };
