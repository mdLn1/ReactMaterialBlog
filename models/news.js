let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let newsSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  postedDate: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false },
  link: { type: String },
  displayStartDate: { type: Date, required: true },
  displayEndDate: { type: Date, required: true },
  outcomeDecided: { type: Boolean },
  outcomeDate: { type: Date },
  reports: [
    {
      reportedBy: { type: String, required: true },
      reason: { type: String, required: true },
      reportedDate: { type: Date, default: Date.now },
    },
  ],
  previousVersions: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      dateEdited: { type: Date, required: true },
    },
  ],
});

let postModel = mongoose.model("News", newsSchema);

module.exports = postModel;
