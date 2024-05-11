const { jWTAcess } = require("../../middlewares/jwtAuth");

async function signedAccess(req, res, next) {
    if (req.user && req.user.user_id) {
        return await next();
    }
    return res.status(403).json({ error: "You not allowed to do this action" });
}

module.exports = {
    signedAccess
};
