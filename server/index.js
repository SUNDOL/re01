const express = require("express");
const sequelize = require('./config/db');
const cors = require("cors");

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

const postController = require('./controller/PostController');
const userController = require("./controller/UserController");

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/user', userController);
app.use('/api/post', postController);


sequelize.sync({ force: true }).then(() => {
    console.log("DB Sync Complete");
});

app.listen(port, () => {
    console.log(`Success: https://localhost:${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});