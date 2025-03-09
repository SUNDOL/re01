const express = require("express");
const sequelize = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');
const cors = require("cors");

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

const postController = require('./controllers/PostController');

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.post('/posts', postController.CreatePost);

sequelize.sync({ force: true }).then(() => {
    console.log("DB Sync Complete");
});

app.listen(port, () => {
    console.log(`Success: https://localhost:${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});