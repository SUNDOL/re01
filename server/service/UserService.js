const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EmailCheck = async (uEmail) => {
    const emailCheck = await User.findOne({ where: { uEmail } });
    return emailCheck ? "이메일 사용 불가." : "이메일 사용 가능.";
};

const NicknameCheck = async (uNickname) => {
    const nicknameCheck = await User.findOne({ where: { uNickname } });
    return nicknameCheck ? "닉네임 사용 불가." : "닉네임 사용 가능.";
};

const CreateUser = async (uEmail, uNickname, uPassword) => {
    try {
        const newUser = await User.create({
            uEmail,
            uNickname,
            uPassword
        });
        return newUser;
    } catch (e) {
        throw new Error("사용자 생성 실패.");
    };
};

const Login = async (uEmail, uPassword) => {
    const user = await User.findOne({ where: { uEmail: uEmail } });
    if (!user) {
        throw new Error("그런 유저 없다.");
    };
    const isPasswordValid = await bcrypt.compare(uPassword, user.uPassword);
    if (!isPasswordValid) {
        throw new Error("패스워드가 이상한데?");
    };
    const token = jwt.sign(
        { id: user.uId, email: user.uEmail },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return token;
};


module.exports = { EmailCheck, NicknameCheck, CreateUser, Login };