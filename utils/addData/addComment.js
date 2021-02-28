if (require("dotenv")) require("dotenv").config();
const mongoConnect = require("../mongoConnect");

const addComment = async () => {
  mongoConnect();

  const Comment = require("../../models/comment");
  const Post = require("../../models/post");
  const User = require("../../models/user");

  const user = await User.findOne({}, "_id");

  const post = await Post.findOne({}, "_id");

  let newComment = new Comment({
    content: "This is a comment",
    author: user,
    postId: post._id,
  });

  await newComment.save();

  await Post.updateOne(
    {
      _id: post._id,
    },
    {
      $push: {
        comments: newComment,
      },
    }
  );
};

(async () => await addComment())();

console.log("finished");
