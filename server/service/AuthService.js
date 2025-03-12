const jwt = require("jsonwebtoken");
const { User } = require("../model/User");
require("dotenv").config();

module.exports = {
    login,
    logout
};