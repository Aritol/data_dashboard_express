var express = require("express");
var router = express.Router();

const usersController = require("../controllers/users");

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);

module.exports = router;
