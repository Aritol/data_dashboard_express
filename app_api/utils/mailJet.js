require("dotenv").config();

const Mailjet = require("node-mailjet");

const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC || "your-api-key",
    apiSecret: process.env.MJ_APIKEY_PRIVATE || "your-api-secret"
});
// 6cb26213d801dbede399963ac71c0502
module.exports = mailjet;
// api key 8c58f6e4fe26461ae4682602f59fb164
// Secret  key 7eef4270fc0a47247e8effcfd03fde35
