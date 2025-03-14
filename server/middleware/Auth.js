const jwt = require("jsonwebtoken");
const { User } = require("../model/User");
const { resHandler } = require("../middleware/Res");
require("dotenv").config();

const refreshAccessToken = async (req, res, next) => {
    try {
        const { rtk } = req.cookies;
        if (!rtk) {
            return res.response(401);
        };
        const dec = jwt.verify(rtk, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByPk(dec.id);
        if (!user) {
            return res.response(404);
        };
        const newAToken = jwt.sign(
            {
                id: user.uId,
                email: user.uEmail
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
            }
        );
        res.setHeader("Authorization", `Bearer ${newAToken}`);
        req.user = {
            id: user.uId,
            email: user.uEmail
        };
        next();
    } catch (e) {
        return res.response(401);
    };
};

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith("Bearer ")) {
        return res.response(401);
    };
    const aToken = authorization.split(" ")[1];
    try {
        const dec = jwt.verify(aToken, process.env.JWT_ACCESS_SECRET);
        req.user = {
            id: dec.id,
            email: dec.email
        };
        return next();
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            return refreshAccessToken(req, res, next);
        };
        return res.response(401);
    };
};

module.exports = { authMiddleware, refreshAccessToken };
