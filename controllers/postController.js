if (require("dotenv")) require("dotenv").config();
const Post = require("../models/post");
const User = require("../models/post");
const HttpError = require("../utils/httpError");

async function createPost(req, res) {
  const { title, content } = req.body;

  const user = await User.findById(req.user.id, "email username name _id");

  let newPost = new Post({
    title,
    content,
    author: user,
  });

  await newPost.save();

  return res.status(201).json({ post: newPost });
}

async function getAllPosts(req, res) {
  return res.status(200).json({ posts: await Post.find({}) });
}

module.exports = { createPost, getAllPosts };
