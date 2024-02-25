const jwt = require("jsonwebtoken");

const expiresIn = "60m";
// const expiresIn = "1m";
const tokenKey = "Our Token Key"; // Save in .env !!!

function parseBearer(bearer, headers) {
    let token = null;
    if (bearer.startsWith("Bearer ")) {
        token = bearer.slice(7, bearer.length);
        // console.log("token");
        // console.log(token);
    }
    const decoded = jwt.verify(token, prepareSecret(headers));
    return decoded;
}

function prepareToken(data, headers) {
    return jwt.sign(data, prepareSecret(headers), { expiresIn });
}

function prepareSecret(headers) {
    return tokenKey + headers["user-agent"] + headers["accept-language"];
}

module.exports = { parseBearer, prepareToken };
