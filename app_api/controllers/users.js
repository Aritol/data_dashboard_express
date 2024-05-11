const UsersModel = require("../models/users");
const { prepareToken } = require("../utils/token");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const sendJSONResponse = (res, status, content) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(status).json(content);
};

module.exports.getList = function (req, res) {
    UsersModel.find({})
        .select("_id name")
        .exec(function (err, users) {
            if (err)
                return sendJSONResponse(res, 500, {
                    success: false,
                    err: { msg: "Fetch faild!" }
                });

            sendJSONResponse(res, 200, { success: true, data: users });
        });
};

async function signup(req, res) {
    try {
        const currentDate = new Date().getTime(); // Текущая дата и время в миллисекундах
        const randomNumber = Math.floor(Math.random() * 1000000) + 10000; // Генерируем случайное число от 10000 до 999999
        const userId = currentDate.toString() + randomNumber.toString();
        const sliceNumber = Math.floor(Math.random() * 3) + 4;
        const user = new UsersModel({
            userId: userId.slice(0, sliceNumber),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
        user.setPassword(req.body.password);
        await user.save();

        const token = prepareToken(
            {
                id: user._id,
                name: user.name
            },
            req.headers
        );

        return res.status(201).json({
            result: "Signuped successfully",
            token
        });
    } catch (err) {
        return res.status(500).json({ error: "Signup error" });
    }
}

async function login(req, res) {
    console.log("req.headers");
    console.log(req.headers);
    try {
        if (!req.body.email || !req.body.email) {
            return res.status(401).json({ error: "fill required fiellds" });
        }
        const user = await UsersModel.findOne({ email: req.body.email }).exec();
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        if (!user.validPassword(req.body.password)) {
            return res.status(401).json({ error: "Login error" });
        }

        const token = prepareToken(
            {
                id: user._id,
                name: user.name
            },
            req.headers
        );
        const expiresAt = new Date().getTime() + 36000000;
        return res.status(200).json({
            status: true,
            user: {
                authData: {
                    userId: user.userId,
                    name: user._doc.name,
                    access_token: token
                },
                expiresAt
            }
        });
    } catch (err) {
        return res.status(500).json({ error: "Login error" });
    }
}
const getUserData = async (req, res) => {};

const saveImage = async (req, res) => {
    const { userId } = req.body || 0;
    if (userId) {
        const storageDir = path.join(
            __dirname,
            `../../storage/images/${userId}`
        );
        const user = await UsersModel.findOne({ userId: userId });
        if (!user) {
            console.error(" користувача не знайдено");
            return res
                .status(500)
                .send({ error: "Помилка, користувача не знайдено" });
        }

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, storageDir);
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + path.extname(file.originalname));
            }
        });
        user.photo = Date.now() + path.extname(file.originalname);

        await user.save();

        const upload = multer({ storage: storage });

        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }
        upload.single("file")(req, res, (err) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .send({ error: "Помилка при завантаженні файлу" });
            }
            return res.status(200).send({ uploadSuccess: true });
        });
    }
    return res.status(500).send({ error: "Помилка" });
};

const deleteImage = async (req, res) => {
    const userId = req.user.user_id || 0;
    if (userId) {
        try {
            const user = await UsersModel.findOne({ userId: userId });
            delete user.photo;
            await record.save();
            return res.status(200).send({ success: "Помилка" });
        } catch (error) {
            console.error("Виникла помилка:", error);
            return res.status(500).json({
                error: "Виникла помилка при видаленні поля із запису"
            });
        }
    }
    return res.status(500).send({ error: "Помилка" });
};

module.exports = {
    login,
    signup,
    getUserData,
    saveImage,
    deleteImage
};
