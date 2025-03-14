const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const resHandler = require("./middleware/Res");

const sequelize = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

const authController = require("./controller/AuthController");
const userController = require("./controller/UserController");
const postController = require('./controller/PostController');

const { generateDummyData } = require("./dummydata");

const app = express();
const port = 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(resHandler);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/auth', authController);
app.use('/user', userController);
app.use('/post', postController);

sequelize.sync({ force: true }).then(() => {
    console.log("DB Sync Complete");
    generateDummyData();
});

app.listen(port, () => {
    console.log(`Server ON http://localhost:${port}`);
    console.log(`Swagger UI http://localhost:${port}/api/docs`);
});