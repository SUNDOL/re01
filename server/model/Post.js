const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Post = sequelize.define('Post', {
    pId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    pWriter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'uId'
        }
    },
    pTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pContent: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

Post.belongsTo(User, { foreignKey: 'pWriter' });
User.hasMany(Post, { foreignKey: 'pWriter' });

module.exports = Post;