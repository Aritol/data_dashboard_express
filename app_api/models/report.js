const mongoose = require("mongoose");
const crypto = require("crypto");
const moment = require("moment");

const { Schema } = mongoose;

function getCurrentDate() {
    return moment().format("YYYY-MM-DD");
}

const ReportsSchema = new Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 50 },
    userId: { type: Number, required: true, minlength: 3, maxlength: 10 },
    chartType: { type: String, required: true, minlength: 1, maxlength: 20 },
    fileType: { type: String, required: true, minlength: 3, maxlength: 10 },
    owner: { type: String, required: true, minlength: 1, maxlength: 50 },
    lastViewed: { type: Date, required: false, default: getCurrentDate },
    entryKey: { type: String, required: false, minlength: 1, maxlength: 50 },
    countData: { type: Array, required: true, default: [] },
    periodsData: { type: Array, required: false, default: [] },
    keysToGroup: { type: Array, required: false, default: [] },
    labels: { type: Array, required: true, default: [] },
    chartData: { type: Array, required: true, default: [] }
    // data: { type: Object, required: true, default: {} }
    // archived: { type: Boolean, required: false, default: false }
});

module.exports = mongoose.model("Reports", ReportsSchema);
