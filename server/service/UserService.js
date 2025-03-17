const User = require("../model/User");
const bcrypt = require("bcryptjs");

const createUser = async (email, password, nickname) => {
    try {
        const eCheck = await User.findOne({ where: { uEmail: email } });
        if (eCheck) {
            throw { code: 409 };
        };
        const nCheck = await User.findOne({ where: { uNickname: nickname } });
        if (nCheck) {
            throw { code: 409 };
        };
        const data = await User.create({
            uEmail: email,
            uPassword: password,
            uNickname: nickname
        });
        const { uPassword, ...newData } = data.dataValues;
        return {
            id: newData.uId,
            email: newData.uEmail,
            nickname: newData.uNickname
        };
    } catch (e) {
        throw { code: e.code };
    };
};

const readUser = async (id) => {
    try {
        const data = await User.findOne({
            where: { uId: id },
            attributes: [
                'uEmail',
                'uNickname',
                'createdAt',
                'updatedAt'
            ]
        });
        if (!data) {
            throw { code: 404 };
        };
        return {
            email: data.uEmail,
            nickname: data.uNickname,
            cDate: data.createdAt,
            uDate: data.updatedAt
        };
    } catch (e) {
        throw { code: e.code };
    };
};

const updateUser = async (id, nickname) => {
    try {
        const data = await User.findByPk(id);
        if (!data) {
            throw { code: 404 };
        };
        const newData = await data.update({ uNickname: nickname });
        return {
            nickname: newData.uNickname,
            uDate: newData.updatedAt
        };
    } catch (e) {
        throw { code: e.code };
    };
};

const deleteUser = async (id) => {
    try {
        const data = await User.findByPk(id);
        if (!data) {
            throw { code: 404 };
        };
        await data.destroy();
        return true;
    } catch (e) {
        throw { code: e.code };
    };
};

const emailCheck = async (email) => {
    try {        
        const data = await User.findOne({ where: { uEmail: email } });
        return data ? "not available" : "available";
    } catch (e) {
        throw { code: e.code };
    };
};

const nicknameCheck = async (nickname) => {
    try {        
        const data = await User.findOne({ where: { uNickname: nickname } });
        return data ? "not available" : "available";
    } catch (e) {
        throw { code: e.code };
    };
};

const updatePassword = async (id, currentPw, newPw) => {
    try {
        const data = await User.findByPk(id);
        if (!data) {
            throw { code: 404 };
        };
        const match = await bcrypt.compare(currentPw, data.uPassword);
        if (!match) {
            throw { code: 401 };
        };
        data.uPassword = newPw;
        await data.save();
    } catch (e) {
        throw { code: e.code };
    };
};

module.exports = {
    createUser,
    readUser,
    updateUser,
    deleteUser,
    emailCheck,
    nicknameCheck,
    updatePassword
};