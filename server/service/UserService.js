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

const GetUser = async (uId) => {
    const user = await User.findOne({ where: { uId: uId } });
    if (!user) {
        throw new error("사용자를 찾을 수 없습니다.");
    };
    return user;
};

const UpdateUser = async (uId, uNickname, uPassword) => {
    const user = await User.findOne({ where: { uId } });
    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
    };
    if (uNickname) {
        const nicknameCheck = await User.findOne({ where: { uNickname } });
        if (nicknameCheck && nicknameCheck.uId !== uId) {
            throw new Error("닉네임 사용 불가.");
        } else {
            console.log(`${user.uNickname} => ${uNickname}`);
            user.uNickname = uNickname;
        };
    };
    if (uPassword) {
        user.uPassword = await bcrypt.hash(uPassword, 10);
    };
    await user.save();
};

const DeleteUser = async (uId) => {
    const user = await User.findOne({ where: { uId: uId } });
    if (!user) {
        return false;
    } else {
        await user.destroy();
        return true;
    };
};

const Login = async (uEmail, uPassword) => {
    const user = await User.findOne({ where: { uEmail: uEmail } });
    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
    };
    const isPasswordValid = await bcrypt.compare(uPassword, user.uPassword);
    if (!isPasswordValid) {
        throw new Error("사용자를 찾을 수 없습니다.");
    };
    const token = jwt.sign(
        { id: user.uId, email: user.uEmail, nickname: user.uNickname },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return token;
};


module.exports = { EmailCheck, NicknameCheck, CreateUser, GetUser, UpdateUser, DeleteUser, Login };