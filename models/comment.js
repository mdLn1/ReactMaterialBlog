let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let commentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
  outcomeDecided: { type: Boolean },
  outcomeDate: { type: Date },
  postId: { type: String, required: true },
  edited: { type: Boolean, default: false },
  previousVersions: [
    {
      content: { type: String, required: true },
      dateEdited: { type: Date, required: true },
    },
  ],
  reports: [
    {
      reporter: { type: String, required: true },
      reason: { type: String, required: true },
      reportedDate: { type: Date, default: Date.now },
    },
  ],
});

let commentModel = mongoose.model("Comments", commentSchema);

module.exports = commentModel;
