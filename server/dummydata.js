const User = require("./model/User");
const Post = require("./model/Post");

const createDummyUsers = async () => {
    const users = [
        { uEmail: "user1@example.com", uPassword: "password1", uNickname: "user1" },
        { uEmail: "user2@example.com", uPassword: "password2", uNickname: "user2" },
        { uEmail: "user3@example.com", uPassword: "password3", uNickname: "user3" },
    ];
    for (const user of users) {
        await User.create({
            uEmail: user.uEmail,
            uPassword: user.uPassword,
            uNickname: user.uNickname,
        });
    };
};

const createDummyPosts = async () => {
    const users = await User.findAll();
    const posts = [];
    const titles = [
        "첫 번째 게시글", "두 번째 게시글", "세 번째 게시글",
        "네 번째 게시글", "다섯 번째 게시글", "여섯 번째 게시글",
        "일곱 번째 게시글", "여덟 번째 게시글", "아홉 번째 게시글",
        "열 번째 게시글", "열한 번째 게시글", "열두 번째 게시글", "열세 번째 게시글"
    ];
    const contents = [
        "첫 번째 게시글 내용", "두 번째 게시글 내용", "세 번째 게시글 내용",
        "네 번째 게시글 내용", "다섯 번째 게시글 내용", "여섯 번째 게시글 내용",
        "일곱 번째 게시글 내용", "여덟 번째 게시글 내용", "아홉 번째 게시글 내용",
        "열 번째 게시글 내용", "열한 번째 게시글 내용", "열두 번째 게시글 내용", "열세 번째 게시글 내용"
    ];
    for (let i = 0; i < 13; i++) {
        const user = users[i % users.length];
        posts.push({
            pWriter: user.uId,
            pTitle: titles[i],
            pContent: contents[i],
        });
    };
    await Post.bulkCreate(posts);
};

const generateDummyData = async () => {
    await createDummyUsers();
    await createDummyPosts();
    console.log("Dummy Data Ready");
};

module.exports = { generateDummyData };