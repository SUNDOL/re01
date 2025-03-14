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
            include: [
                {
                    model: User,
                    attributes: ["uNickname"]
                }
            ],
            offset,
            limit,
            order: [
                ['updatedAt', 'DESC'],
                ['pId', 'DESC']
            ]
        });
        return {
            posts: rows.map(post => ({
                id: post.pId,
                title: post.pTitle,
                writer: post.User.uNickname,
                updated_at: post.updatedAt
            })),
            totalPosts: count
        };
    } catch (e) {
        throw { code: 500 };
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
        throw { code: 500 };
    };
};

module.exports = {
    listPost,
    createPost,
};