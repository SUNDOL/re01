const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "액세스 거부됨!" });
    try {
        const dec = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = dec;
        next();
    } catch (e) {
        console.error("JWT 인증 에러: ", e);
        res.status(401).json({ msg: "올바르지 않은 토큰!" });
    }
};

module.exports = auth;