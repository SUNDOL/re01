const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
require("dotenv").config();

const login = async (email, password) => {
    try {
        const logUser = await User.findOne({ where: { uEmail: email } });
        if (!logUser) {
            throw { code: 400 };
        };
        const pwCheck = await bcrypt.compare(password, logUser.uPassword);
        if (!pwCheck) {
            throw { code: 401 };
        };
        const atk = jwt.sign(
            {
                id: logUser.uId,
                email: logUser.uEmail
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
            }
        );
        const rtk = jwt.sign(
            {
                id: logUser.uId, email: logUser.uEmail
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
            }
        );
        const [updated] = await User.update({ uRefreshToken: rtk }, { where: { uId: logUser.uId } });
        if (!updated) {
            throw { code: 500 };
        };
        return { atk, rtk };
    } catch (e) {
        throw { code: e.code };
    };
};

const logout = async (rtk) => {
    try {
        const dec = jwt.verify(rtk, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByPk(dec.id);
        if (user) {
            await User.update({ uRefreshToken: null }, { where: { uId: user.uId } })
        };
    } catch (e) {
        throw { code: e.code };
    };
};

module.exports = {
    login,
    logout
};