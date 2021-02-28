let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let commentSchema = new Schema({
  content: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  postedDate: { type: Date, default: Date.now },
  postId: { type: String, required: true },
  edited: { type: Boolean, default: false },
  previousVersions: [
    {
      content: { type: String, required: true },
      dateEdited: { type: Date, default: Date.now },
    },
  ],
});

let commentModel = mongoose.model("Comments", commentSchema);

module.exports = commentModel;
