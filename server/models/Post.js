const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

Post.belongsTo(User, { foreignkey: 'userId' });
User.hasMany(Post, { foreignkey: 'userId' });

module.exports = Post;