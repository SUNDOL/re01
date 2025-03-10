const express = require("express");
const sequelize = require('./config/db');
const cors = require("cors");

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

const userController = require("./controller/UserController");
const postController = require('./controller/PostController');

const bcrypt = require('bcryptjs');
const User = require('./model/User');

const app = express();
const port = 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/user', userController);
app.use('/post', postController);

const dummyUser = async () => {
    try {
        const count = await User.count();
        if (count === 0) {
            await User.create({
                uEmail: 'test001@test.com',
                uNickname: 'test001',
                uPassword: 'password001'
            });
            console.log("더미데이터 저장 완료.");
        }
    } catch (e) {
        console.log("더미데이터 저장 실패."); 
    }
}

sequelize.sync({ force: true }).then(() => {
    console.log("DB Sync Complete");
    dummyUser();
});

app.listen(port, () => {
    console.log(`Success: https://localhost:${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/api/docs`);
});