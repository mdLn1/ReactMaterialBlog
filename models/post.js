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
