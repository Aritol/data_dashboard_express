const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reports");

router.post("/saveReport", reportsController.saveReport);
router.post("/renameReport", reportsController.renameReport);
router.post("/deleteReport", reportsController.deleteReport);
router.post("/refreshLastViewed", reportsController.renameReport);
router.get("/getUserReports/:userId", reportsController.getUserReports);

module.exports = router;
