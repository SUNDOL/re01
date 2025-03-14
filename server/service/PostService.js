const Post = require('../model/Post');
const User = require('../model/User');

const listPost = async (page, limit) => {
    const offset = (page - 1) * limit;
    try {
        const { count, rows } = await Post.findAndCountAll({
            attributes: [
                "pId",
                "pTitle",
                "pWriter",
                "updatedAt"
            ],
            include: [{
                model: User,
                attributes: ["uNickname"]
            }],
            offset,
            limit,
            order: [
                ['updatedAt', 'DESC'],
                ['pId', 'DESC']
            ]
        });
        return {
            posts: rows.map(p => ({
                id: p.pId,
                title: p.pTitle,
                writer: p.User.uNickname,
                updated_at: p.updatedAt
            })),
            totalPosts: count
        };
    } catch (e) {
        throw { code: e.code };
    };
};

const createPost = async ({ id, title, content }) => {
    try {
        const data = await Post.create({
            pWriter: id,
            pTitle: title,
            pContent: content
        });
        return data;
    } catch (e) {
        throw { code: e.code };
    };
};

const readPost = async (id, uId) => {
    try {
        const data = await Post.findOne({
            where: {
                pId: id
            },
            attributes: [
                "pId",
                "pTitle",
                "pContent",
                "pWriter",
                "createdAt",
                "updatedAt"
            ],
            include: [{
                model: User,
                attributes: ["uNickname"]
            }]
        });
        if (!data) {
            throw { code: 404 };
        };
        return {
            id: data.pId,
            title: data.pTitle,
            content: data.pContent,
            writer: data.User.uNickname,
            created_at: data.createdAt,
            updated_at: data.updatedAt,
            can_edit: uId === data.pWriter
        };
    } catch (e) {
        throw { code: 500 };
    };
};

const updatePost = async (id, uId, { title, content }) => {
    try {
        const data = await Post.findOne({
            where: {
                pId: id
            },
            attributes: [
                "pId",
                "pTitle",
                "pContent",
                "pWriter",
                "createdAt",
                "updatedAt"
            ],
            include: [{
                model: User,
                attributes: ["uNickname"]
            }]
        });
        if (!data) {
            throw { code: 404 };
        };
        if (data.pWriter !== uId) {
            throw { code: 401 };
        };
        data.pTitle = title;
        data.pContent = content;
        await data.save();
        return {
            id: data.pId,
            title: data.pTitle,
            content: data.pContent,
            writer: data.User.uNickname,
            created_at: data.createdAt,
            updated_at: data.updatedAt,
            can_edit: uId === data.pWriter
        };
    } catch (e) {
        throw { code: e.code };
    };
};

module.exports = {
    listPost,
    createPost,
    readPost,
    updatePost,
};