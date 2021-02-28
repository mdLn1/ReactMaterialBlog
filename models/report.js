let mongoose = require("mongoose");
const { CONTENT_TYPES } = require("../utils/constants");
let Schema = mongoose.Schema;

let reportSchema = new Schema({
  contentReportedType: { type: String, enum: CONTENT_TYPES },
  contentId: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  dismissed: { type: Boolean, default: false },
  reason: { type: String, required: true, maxlength: 300 },
  reportedDate: { type: Date, default: Date.now },
});

let reportModel = mongoose.model("Reports", reportSchema);

module.exports = reportModel;
