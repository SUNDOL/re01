const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require("bcryptjs");

const User = sequelize.define('User', {
    uId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    uPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uNickname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    uRefreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            user.uPassword = await bcrypt.hash(user.uPassword, 10);
        },
        beforeUpdate: async (user) => {
            if (user.changed("uPassword") && user.uPassword) {
                user.uPassword = await bcrypt.hash(user.uPassword, 10);
            };
        }
    }
});

module.exports = User;