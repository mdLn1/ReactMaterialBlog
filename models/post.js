let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  postedDate: { type: Date, default: Date.now },
  pinned: { type: Boolean },
  edited: { type: Boolean, default: false },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  outcomeDecided: { type: Boolean },
  outcomeDate: { type: Date },
  reports: [
    {
      reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
      },
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

let postModel = mongoose.model("Posts", postSchema);

module.exports = postModel;
