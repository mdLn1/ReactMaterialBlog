let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  hidden: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  postedDate: { type: Date, default: Date.now },
  pinned: { type: Boolean },
  edited: { type: Boolean, default: false },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  previousVersions: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      dateEdited: { type: Date, default: Date.now },
    },
  ],
});

let postModel = mongoose.model("Posts", postSchema);

module.exports = postModel;
