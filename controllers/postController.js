if (require("dotenv")) require("dotenv").config();
const Post = require("../models/post");
const User = require("../models/user");
const { isPostContentValid, isPostTitleValid } = require("../utils/customValidators");
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

  user.publishedPosts.push(newPost);

  await user.save();

  res.status(201).json({ post: newPost });
}

async function editPost(req, res) {
  const { title, content } = req.body;
  const { postId } = req.query;

  if (!postId || typeof postId !== "string")
    throw new HttpError("Post not found");

  const foundPost = await Post.findById(postId, "_id author title content");

  if (!foundPost) throw new HttpError("Post not found");

  let isPostEdited = false;

  if (title && title !== foundPost.title && isPostTitleValid(title)) {
    foundPost.title = title;
    isPostEdited = true;
  }

  if (content && content !== foundPost.content && isPostContentValid(content)) {
    foundPost.content = content;
    isPostEdited = true;
  }

  if (isPostEdited) await foundPost.save();

  res.status(201).json({ post: newPost });
}

async function getAllPosts(req, res) {
  res.status(200).json({ posts: await Post.find({}) });
}

async function deletePost(req, res) {
  const { postId } = req.query;

  if (!postId || typeof postId !== "string")
    throw new HttpError("Post not found");

  if (process.env.ACTUAL_DELETE_DATA_ENABLED) {
    const postDeleted = await Post.findByIdAndDelete(postId);

    if (!postDeleted) throw new HttpError("Failed to delete post", 400);
  } else {
    const postDeleted = await Post.findById(postId);

    postDeleted.deleted = true;

    await postDeleted.save();
  }
  res.status(204).end();
}

async function reportPost(req, res) {
  const { postId } = req.query;
  const { reason } = req.body;

  if (!postId || typeof postId !== "string")
    throw new HttpError("Post not found");

  const reporter = await User.findById(req.user.id, "_id");

  if (!reporter)
    throw new HttpError("You need to be authenticated to make a report.", 401);

  const foundPost = await Post.findById(postId, "_id");

  if (!foundPost) throw new HttpError("Post not found", 404);

  foundPost.reports.push({ reason: reason, reportedBy: reporter });

  await foundPost.save();

  reporter.postsReported.push(foundPost);

  await reporter.save();

  res.status(204).end();
}

module.exports = { createPost, getAllPosts, editPost, deletePost, reportPost };
