const jwt = require("jsonwebtoken");

const expiresIn = "24h";
const tokenKey = "Our Token Key"; // Save in .env !!!

function parseBearer(bearer, headers) {
    let token = null;
    try {
        if (bearer.startsWith("Bearer ")) {
            token = bearer.slice(7, bearer.length);
        }
        const decoded = jwt.verify(token, prepareSecret(headers));
        return decoded;
    } catch (error) {
        console.error("Помилка при верифікації токена:", error);
        return null;
    }
}

function prepareToken(data, headers) {
    return jwt.sign(data, prepareSecret(headers), { expiresIn });
}

function prepareSecret(headers) {
    return tokenKey + headers["user-agent"] + headers["accept-language"];
}

module.exports = { parseBearer, prepareToken };
