const jwt = require("jsonwebtoken");
const { User } = require("../model/User");
require("dotenv").config();

const auth = async (req, res, next) => {
    const aToken = req.header("Authorization")?.replace("Bearer ", "");
    if (!aToken) {
        return res.status(401).json({ msg: "액세스 거부됨. Access Token이 필요함." });
    };
    try {
        const dec1 = jwt.verify(aToken, process.env.JWT_ACCESS_SECRET);
        req.user = { id: dec1.id, email: dec1.email };
        if (Date.now() >= dec1.exp * 1000) {
            const rToken = req.header("x-refresh-token");
            if (!rToken) {
                return res.status(401).json({ msg: "Refresh Token이 필요함." });
            };
            try {
                const dec2 = await jwt.verify(rToken, process.env.JWT_REFRESH_SECRET);
                const user = await User.findByPk(dec2.id);
                if (!user) {
                    return res.status(401).json({ msg: "유효하지 않은 Access Token임." });
                };
                const aToken2 = jwt.sign(
                    { id: user.uId, email: user.uEmail },
                    process.env.JWT_ACCESS_SECRET,
                    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
                );
                res.setHeader("x-new-access-token", aToken2);
                next();
            } catch (e) {
                return res.status(401).json({ msg: "유효하지 않은 Refresh Token임." });
            };
        } else {
            next();
        };
    } catch (e) {
        return res.status(401).json({ msg: "올바르지 않은 토큰!" });
    };
};

module.exports = auth;