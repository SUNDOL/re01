const User = require("../model/User");
const bcrypt = require("bcryptjs");

const createUser = async (email, password, nickname) => {
    const eCheck = await User.findOne({ where: { uEmail: email } });
    if (eCheck) {
        throw { code: 409 };
    };
    const nCheck = await User.findOne({ where: { uNickname: nickname } });
    if (nCheck) {
        throw { code: 409 };
    };
    const user = await User.create({ uEmail: email, uPassword: password, uNickname: nickname });
    const { uPassword, ...info } = user.dataValues;
    return {
        id: info.uId,
        email: info.uEmail,
        nickname: info.uNickname
    };
};

const readUser = async (id) => {
    const user = await User.findOne({
        where: { uId: id },
        attributes: ['uEmail', 'uNickname', 'createdAt', 'updatedAt']
    });
    if (!user) {
        throw { code: 404 };
    };
    return {
        email: user.uEmail,
        nickname: user.uNickname,
        cDate: user.createdAt,
        uDate: user.updatedAt
    };
};

const updateUser = async (id, nickname) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw { code: 404 };
    };
    const updateUser = await user.update({ uNickname: nickname });
    return {
        nickname: updateUser.uNickname,
        uDate: updateUser.uDate
    };
};

const emailCheck = async (email) => {
    const check1 = await User.findOne({ where: { uEmail: email } });
    return check1 ? "no" : "available";
};

const nicknameCheck = async (nickname) => {
    const check2 = await User.findOne({ where: { uNickname: nickname } });
    return check2 ? "no" : "available";
};

const updatePassword = async (id, currentPw, newPw) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw { code: 404 };
    };
    const pwMatch = await bcrypt.compare(currentPw, user.uPassword);
    if (!pwMatch) {
        throw { code: 401 };
    };
    user.uPassword = newPw;
    await user.save();
};

module.exports = {
    createUser,
    readUser,
    updateUser,
    emailCheck,
    nicknameCheck,
    updatePassword
};