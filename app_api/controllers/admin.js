const { isEmpty, get } = require("lodash");
require("dotenv").config();
const mailjet = require("node-mailjet");

const sendJSONResponse = (res, status, content) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(status).json(content);
};

const getEmailTemplate = (name, phoneNumber, text) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 40px auto;
        }
        .header {
            background-color: #4CAF50;
            padding: 10px 20px;
            color: #ffffff;
            border-radius: 10px 10px 0 0;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
        }
        .content p {
            line-height: 1.6;
            color: #333333;
        }
        .content h2 {
            color: #4CAF50;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Запит на зворотній дзвінок</h1>
        </div>
        <div class="content">
            <h2>Деталі запиту</h2>
            <p><strong>Ім'я користувача:</strong> ${name}</p>
            <p><strong>Номер телефону:</strong> ${phoneNumber}</p>
            ${text ? `<p><strong>Коментар:</strong> ${text}</p>` : ""}
        </div>
        <div class="footer">
            <p>Цей лист було автоматично згенеровано з веб-сайту EasyAnalize.</p>
        </div>
    </div>
</body>
</html>
`;

const callBackToUser = async (req, res) => {
    const { name = "", phoneNumber = "", text = "" } = req.body;

    if (!isEmpty(name) && !isEmpty(phoneNumber)) {
        const mailjetClient = mailjet.apiConnect(
            process.env.MAILJET_API_KEY,
            process.env.MAILJET_API_SECRET
        );
        try {
            const request = mailjetClient
                .post("send", { version: "v3.1" })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: "maxdurant2001@gmail.com",
                                Name: "EasyAnalize"
                            },
                            To: [
                                {
                                    Email: "pymperpro337@gmail.com",
                                    Name: "Admin"
                                }
                            ],
                            Subject: "Користувач замовив зворотній виклик",
                            HTMLPart: getEmailTemplate(name, phoneNumber, text)
                        }
                    ]
                });
            const result = await request;
            const resultStatus = get(result, "body", false) || false;

            if (resultStatus) {
                return res.status(200).json({ status: true });
            } else {
                return res
                    .status(500)
                    .json({ error: "Помилка при надсиланні листа" });
            }
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ error: "Помилка при надсиланні листа" });
        }
    }
    return res.status(500).json({ error: "Помилка" });
};

module.exports = {
    callBackToUser
};
