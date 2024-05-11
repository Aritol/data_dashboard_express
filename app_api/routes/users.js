const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");
const { signedAccess } = require("../helpers/auth");

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);
router.post("/saveImage", signedAccess, usersController.saveImage);
router.post("/deleteImage", signedAccess, usersController.deleteImage);
router.post("/gets", signedAccess, usersController.getUserData);

module.exports = router;
