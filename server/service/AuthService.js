const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
require("dotenv").config();

const login = async (email, password) => {
    const logUser = await User.findOne({ where: { uEmail: email } });
    if (!logUser) {
        throw { status: 400, msg: "이메일 또는 패스워드가 잘못되었음." };
    };
    const pwCheck = await bcrypt.compare(password, logUser.uPassword);
    if (!pwCheck) {
        throw { status: 400, msg: "이메일 또는 패스워드가 잘못되었음." };
    };
    const atk = jwt.sign(
        { id: logUser.uId, email: logUser.uEmail, nickname: logUser.uNickname },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    );
    const rtk = jwt.sign(
        { id: logUser.uId, email: logUser.uEmail },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
    const [updated] = await User.update({ uRefreshToken: rtk }, { where: { uId: logUser.uId } });
    if (!updated) {
        throw { status: 500, msg: "Refresh Token 저장 실패."};
    };
    return { atk, rtk };
};

const logout = async (rtk) => {
    try {
        const dec = jwt.verify(rtk, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByPk(dec.id);
        if (user) {
            await User.update({ uRefreshToken: null }, { where: { uId: user.uId } })
        };
    } catch (e) {
        throw { status: 401, msg: "Refresh Token 유효하지 않음." };
    };
};

module.exports = {
    login,
    logout
};