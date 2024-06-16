const reportModel = require("../models/report");
const { get, isEmpty } = require("lodash");

const saveReport = async (req, res) => {
    console.log("req");
    console.log(req.body);
    const name = get(req.body, "name", "") || "";
    const userId = get(req.body, "userId", 0) || 0;
    const chartType = get(req.body, "chartType", "") || "";
    const fileType = get(req.body, "fileType", "") || "";
    const owner = get(req.body, "owner", "") || "";
    const lastViewed = get(req.body, "lastViewed", "") || "";
    const countData = get(req.body, "countData", "") || "";
    const entryKey = get(req.body, "entryKey", "") || "";
    const periodsData = get(req.body, "periodsData", []) || [];
    const keysToGroup = get(req.body, "keysToGroup", []) || [];
    const labels = get(req.body, "labels", []) || [];
    const chartData = get(req.body, "chartData", []) || [];
    if (
        !isEmpty(name) &&
        userId &&
        !isEmpty(chartType) &&
        !isEmpty(fileType) &&
        !isEmpty(owner) &&
        !isEmpty(labels) &&
        !isEmpty(chartData)
    ) {
        try {
            const paramsToSet = {
                name,
                userId,
                chartType,
                fileType,
                owner,
                lastViewed,
                // entryKey,
                countData,
                labels,
                chartData
                // data
            };
            if (!isEmpty(periodsData)) {
                paramsToSet.periodsData = periodsData;
            }
            if (entryKey && entryKey.length) {
                paramsToSet.entryKey = entryKey;
            }
            if (!isEmpty(keysToGroup)) {
                paramsToSet.keysToGroup = keysToGroup;
            }
            const report = new reportModel(paramsToSet);

            const saveDoc = await report.save();
            if (saveDoc) {
                return res.status(200).json({
                    result: "Звіт успішно збережено"
                });
            }
        } catch (error) {
            console.log("err --->", error);
            return res
                .status(500)
                .json({ error: "При збереженні звіту сталась помилка" });
        }
    } else {
        console.log("sss");
        return res.status(500).json({
            error: "При збереженні звіту сталась помилка (не всі поля заповнені)"
        });
    }
};

const deleteReport = async (req, res) => {
    const { reportId = 0 } = req.body;
    if (reportId) {
        try {
            const deletedReport = await reportModel.findByIdAndDelete({
                _id: reportId
            });
            if (deletedReport) {
                return res.status(200).json({
                    message: "Звіт успішно видалено",
                    status: true
                });
            } else {
                return res.status(404).json({ message: "Звіт не знайдено" });
            }
        } catch (error) {
            console.error("Помилка при видаленні звіту:", error);
            return res.status(500).json({
                message: "Помилка при видаленні звіту"
            });
        }
    }
};
const refreshLastViewed = async (req, res) => {
    const { reportId } = req.body;
    if (!reportId) {
        return res.status(400).json({ message: "Не всі поля відправлені" });
    }
    try {
        const newLastViewed = moment().format("YYYY-MM-DD");
        const updatedReport = await reportModel.findByIdAndUpdate(
            reportId,
            { lastViewed: newLastViewed },
            { new: true }
        );
        if (updatedReport) {
            return res.status(200).json({
                message: "Успішно",
                status: true
            });
        } else {
            return res.status(404).json({ message: "Звіт не знайдено" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Помилка"
        });
    }
};
const renameReport = async (req, res) => {
    const { reportId, newName } = req.body;
    if (!reportId || !newName) {
        return res.status(400).json({ message: "Не всі поля відправлені" });
    }
    try {
        const updatedReport = await reportModel.findByIdAndUpdate(
            reportId,
            { name: newName },
            { new: true }
        );

        if (updatedReport) {
            return res.status(200).json({
                message: "Звіт успішно перейменовано",
                status: true
            });
        } else {
            return res.status(404).json({ message: "Звіт не знайдено" });
        }
    } catch (error) {
        console.error("Помилка при перейменуванні звіту:", error);
        return res.status(500).json({
            message: "Помилка при перейменуванні звіту"
        });
    }
};

const getUserReports = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const userReports = await reportModel.find({ userId: userId });
        console.log("userReports");
        console.log(userReports);
        if (userReports.length > 0) {
            res.status(200).json({
                reports: userReports
            });
        } else {
            res.status(200).json({ message: "Звітів не знайдено" });
        }
    } catch (error) {
        console.error("Помилка при завантаженні звітів", error);
        res.status(500).json({ message: "Помилка при завантаженні звітів" });
    }
};

module.exports = {
    saveReport,
    deleteReport,
    renameReport,
    refreshLastViewed,
    getUserReports
};
