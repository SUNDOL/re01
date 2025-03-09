const express = require("express");
const sequelize = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());

sequelize.sync({ force: true }).then(() => {
    console.log("DB Sync Complete");
});

app.listen(port, () => {
    console.log(`Success: https://localhost:${port}`);
});