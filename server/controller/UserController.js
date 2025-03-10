/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User 관련 API
 */
const express = require("express");
const userService = require("../service/UserService");
const auth = require("../middleware/Auth");
const router = express.Router();
/**
 * @swagger
 * /user/emailcheck:
 *   get:
 *     tags:
 *       - User
 *     summary: 이메일 중복 체크
 *     description: 이메일 사용 가능 여부를 체크합니다.
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: 이메일 주소
 *     responses:
 *       200:
 *         description: 이메일 사용 가능 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: 이메일 사용 가능 여부 메시지
 *       400:
 *         description: 잘못된 요청
 */
router.get("/emailcheck", async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ msg: "이메일을 입력해주세요." });
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ msg: "올바른 이메일 형식이 아닙니다." });
    };
    const result = await userService.EmailCheck(email);
    return res.json({ msg: result });
});
/**
 * @swagger
 * /user/nickcheck:
 *   get:
 *     tags:
 *       - User
 *     summary: 닉네임 중복 체크
 *     description: 닉네임 사용 가능 여부를 체크합니다.
 *     parameters:
 *       - in: query
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *         description: 닉네임
 *     responses:
 *       200:
 *         description: 닉네임 사용 가능 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: 닉네임 사용 가능 여부 메시지
 *       400:
 *         description: 잘못된 요청
 */
router.get("/nickcheck", async (req, res) => {
    const { nickname } = req.query;
    if (!nickname) return res.status(400).json({ msg: "닉네임을 입력해주세요." });
    const result = await userService.NicknameCheck(nickname);
    return res.json({ msg: result });
});
/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     summary: 사용자 회원가입
 *     description: 이메일, 닉네임, 비밀번호를 이용하여 회원가입을 진행합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *                 example: "example@example.com"
 *               nickname:
 *                 type: string
 *                 description: 사용자 닉네임
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: 성공 메시지
 *                   example: "회원가입 성공."
 *       400:
 *         description: 잘못된 요청 (필수 필드 누락, 이메일/닉네임 중복 등)
 *       500:
 *         description: 서버 오류
 */
router.post("/", async (req, res) => {
    const { email, nickname, password } = req.body;
    if (!email || !nickname || !password) {
        return res.status(400).json({ msg: "모든 필드를 입력해주세요." });
    };
    try {
        const emailCheck = await userService.EmailCheck(email);
        const nicknameCheck = await userService.NicknameCheck(nickname);
        if (emailCheck === "이메일 사용 불가.") {
            return res.status(400).json({ msg: emailCheck });
        };
        if (nicknameCheck === "닉네임 사용 불가.") {
            return res.status(400).json({ msg: nicknameCheck });
        };
        const newUser = await userService.CreateUser(email, nickname, password);
        if (!newUser) {
            return res.status(500).json({ msg: "서버 오류." });
        };
        return res.status(201).json({ msg: "회원가입 성공." });
    } catch (e) {
        return res.status(500).json({ msg: "서버 오류." });
    };
});
/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: 로그인
 *     description: 사용자가 이메일과 비밀번호로 로그인하고 JWT 토큰을 발급받습니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *     responses:
 *       200:
 *         description: 로그인 성공, JWT 토큰 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT 토큰
 *       400:
 *         description: 잘못된 이메일 또는 비밀번호
 *       500:
 *         description: 서버 에러
 */
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "이메일과 패스워드를 정확히 입력해주세요."});
    };
    try {
        const token = await userService.Login(email, password);
        return res.json({ msg: "로그인 성공.", token: token });
    } catch (e) {
        console.error("로그인 오류: ", e);
        return res.status(400).json({ msg: "서버 오류." });
    };
});

module.exports = router;