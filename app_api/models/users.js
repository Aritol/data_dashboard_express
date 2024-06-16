const mongoose = require("mongoose");
const crypto = require("crypto");

const { Schema } = mongoose;

const UsersSchema = new Schema({
    userId: { type: Number, required: true, minlength: 5, maxlength: 6 },
    firstName: { type: String, required: true, minlength: 4, maxlength: 100 },
    lastName: { type: String, required: true, minlength: 4, maxlength: 100 },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 100
    },
    photo: {
        type: String,
        required: false,
        minlength: 0,
        maxlength: 100
    },
    hash: String, //поле, де буде зберігатися хеш пароля
    salt: String //поле, де буде зберігатися ключ
});

//--------------- Функція для формування хешу пароля -----------------
UsersSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
        .toString("hex");
};

//---------------- Функція для перевірки правильності пароля ------------
UsersSchema.methods.validPassword = function (password) {
    //----------- Формуємо хеш переданого (для перевірки) пароля ----
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
        .toString("hex");
    //------------ Перевіряємо, чи одержано такий же хеш як у базі -------------
    return this.hash === hash;
};

module.exports = mongoose.model("Users", UsersSchema);
