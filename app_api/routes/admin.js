const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

router.post("/callBack", adminController.callBackToUser);

module.exports = router;
