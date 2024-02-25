const UsersModel = require("../models/users");
const { prepareToken } = require("../utils/token");

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
                    err: { msg: "Fetch faild!" },
                });

            sendJSONResponse(res, 200, { success: true, data: users });
        });
};

module.exports.signup = function (req, res) {
    var user = new UsersModel({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    user.setPassword(req.body.password);
    user.save()
        .then((user) => {
            const token = prepareToken(
                {
                    id: user._id,
                    name: user.name,
                },
                req.headers
            );
            return res.status(201).json({
                result: "Signuped successfully",
                token,
            });
        })
        .catch((err) => {
            return res.status(500).json({ error: "Signup error" });
        });
};

module.exports.login = function (req, res) {
    console.log("req.body");
    console.log(req.body);
    if (!req.body.email) {
        return res.status(401).json({ error: "Email is required" });
    }
    console.log(req.body.email);
    console.log(req.body.password);
    if (!req.body.password) {
        return res.status(401).json({ error: "Password is required" });
    }
    UsersModel.findOne({ email: req.body.email })
        .exec()
        .then((user) => {
            console.log("zahodit2");
            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }
            if (!user.validPassword(req.body.password)) {
                return res.status(401).json({ error: "Login error" });
            }
            const token = prepareToken(
                {
                    id: user._id,
                    name: user.name,
                },
                req.headers
            );
            const expiresAt = new Date().getTime() + 36000000;
            res.status(200).json({
                result: "Authorized",
                user: {
                    authData: {
                        name: user._doc.name,
                        access_token: token,
                    },
                    expiresAt,
                },
            });
        })
        .catch((err) => {
            return res.status(401).json({ error: "Login error" });
        });
};
