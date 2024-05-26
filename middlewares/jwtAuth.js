const { parseBearer } = require("../app_api/utils/token");
module.exports = async (req, res, next) => {
    let user = null;

    try {
        const token =
            req.headers && req.headers.authorization
                ? req.headers.authorization
                : "";

        if (token) {
            const validateToken = parseBearer(
                req.headers.authorization,
                req.headers
            );
            if (validateToken) {
                user = validateToken;
                user.user_id = req.headers.user_id;
            }
        }
    } catch (error) {
        console.log(error);
    }
    req.user = user;
    console.log("req.user 1 ");
    console.log(req.user);
    return next();
};
