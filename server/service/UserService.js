const User = require("../model/User");
const bcrypt = require("bcryptjs");

const createUser = async (email, password, nickname) => {
    const eCheck = await User.findOne({ where: { uEmail: email } });
    if (eCheck) {
        throw { status: 400, msg: "이메일 사용 불가." };
    };
    const nCheck = await User.findOne({ where: { uNickname: nickname } });
    if (nCheck) {
        throw { status: 400, msg: "닉네임 사용 불가." };
    };
    const user = await User.create({ uEmail: email, uPassword: password, uNickname: nickname });
    const { uPassword, ...info } = user.dataValues;
    return info;
};

const readUser = async (id) => {
    const user = await User.findOne({
        where: { uId: id },
        attributes: ['uEmail', 'uNickname', 'createdAt', 'updatedAt']
    });
    if (!user) return null;
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
        throw { status: 404, msg: "사용자를 찾을 수 없음." };
    };
    const updateUser = await user.update({ uNickname: nickname });
    return { nickname: updateUser.uNickname, uDate: updateUser.uDate };
};

const emailCheck = async (email) => {
    const check1 = await User.findOne({ where: { uEmail: email } });
    return !check1;
};

const nicknameCheck = async (nickname) => {
    const check2 = await User.findOne({ where: { uNickname: nickname } });
    return !check2;
};

const updatePassword = async (id, currentPw, newPw) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw { status: 404, msg: "사용자를 찾을 수 없음." };
    };
    const pwMatch = await bcrypt.compare(currentPw, user.uPassword);
    if (!pwMatch) {
        throw { status: 400, msg: "패스워드 불일치." };
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