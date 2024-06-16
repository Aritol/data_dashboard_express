const UsersModel = require("../models/users");
const { prepareToken } = require("../utils/token");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { get, isEmpty } = require("lodash");
const cloudinary = require("../utils/cloudinary");

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
        const currentDate = new Date().getTime(); // Текущя дата і час в мілісекундах
        const randomNumber = Math.floor(Math.random() * 1000000) + 10000; //Генеруєм случайне число від 10000 до 999999
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
        console.log("err --->", err);
        return res.status(500).json({ error: "Signup error" });
    }
}

async function login(req, res) {
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
        console.log("err --->", err);
        return res.status(500).json({ error: "Login error" });
    }
}
const getUserData = async (req, res) => {
    try {
        const userId = get(req.user, "user_id", 0) || 0;
        if (!userId) {
            return sendJSONResponse(res, 400, {
                success: false,
                err: { msg: "Invalid user ID" }
            });
        }

        const user =
            get(await UsersModel.find({ userId }).select().exec(), "[0]", {}) ||
            {};
        let userData = {};
        if (user && !isEmpty(user)) {
            userData = {
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                photo: user.photo || ""
            };
        }
        sendJSONResponse(res, 200, { success: true, userData });
    } catch (err) {
        console.error("Fetch failed:", err);
        sendJSONResponse(res, 500, {
            success: false,
            err: { msg: "Fetch failed!" }
        });
    }
};

const saveImage = async (req, res) => {
    const userId = get(req.user, "user_id", 0) || 0;
    if (userId) {
        const storage = multer.diskStorage({
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            }
        });

        const upload = multer({ storage: storage }).single("file");
        const user = await UsersModel.findOne({ userId: userId });

        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .send({ error: "Помилка при завантаженні файлу" });
            }

            cloudinary.uploader.upload(req.file.path, function (error, result) {
                if (error) {
                    console.error(error);
                    return res.status(500).send({
                        error: "Помилка при завантаженні файлу на сервер"
                    });
                }
                console.log("result");
                console.log(result);
                const photoUrl = get(result, "url", "") || "";
                if (photoUrl && photoUrl.length) {
                    user.photo = photoUrl;
                    user.save();
                }
                return res
                    .status(200)
                    .send({ uploadSuccess: true, url: result.secure_url });
            });
        });
    } else {
        return res.status(400).send({ error: "Користувач не авторизований" });
    }
};

const deleteImage = async (req, res) => {
    const userId = req.user.user_id || 0;
    if (userId) {
        try {
            const user = await UsersModel.findOne({ userId: userId });
            user.photo = "";
            console.log("user");
            console.log(user);
            await user.save();
            return res.status(200).send({ success: true });
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
