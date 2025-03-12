const User = require("../model/User");

const emailCheck = async (email) => {
    const check1 = await User.findOne({ where: { uEmail: email } });
    return !check1;
};

const nicknameCheck = async (nickname) => {
    const check2 = await User.findOne({ where: { uNickname: nickname } });
    return !check2;
};

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

module.exports = {
    emailCheck,
    nicknameCheck,
    createUser,
    readUser,
};