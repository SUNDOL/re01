const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Post = sequelize.define('Post', {
    bId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bContent: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

Post.belongsTo(User, { foreignkey: 'uId' });
User.hasMany(Post, { foreignkey: 'uId' });

module.exports = Post;