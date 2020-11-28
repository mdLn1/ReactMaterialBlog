let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
  pinned: { type: Boolean },
});

let postModel = mongoose.model("Posts", postSchema);

module.exports = postModel;
