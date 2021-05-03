if (require("dotenv")) require("dotenv").config();
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const {
  isPostContentValid,
  isPostTitleValid,
} = require("../utils/customValidators");
const HttpError = require("../utils/httpError");
const {
  DEFAULT_PAGES_SIZE,
  ALLOWED_MONGO_SORT_FILTERS,
} = require("../utils/constants");

async function createPost(req, res) {
  const { title, content } = req.body;

  const user = await User.findById(req.user.id, "email username name _id");

  let newPost = new Post({
    title,
    content,
    author: user,
  });

  await newPost.save();

  res.status(201).json({ post: newPost });
}

async function editPost(req, res) {
  const { title, content } = req.body;
  const { postId } = req.params;

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

  if (isPostEdited) {
    foundPost.edited = true;
    await foundPost.save();
    await Post.updateOne(
      {
        _id: postId,
      },
      {
        $push: {
          previousVersions: { title: title, content: content },
        },
      }
    );
  }
  res.status(200).json({ post: foundPost });
}

async function getPosts(req, res) {
  let { sortOrder, pageNumber } = req.query;

  if (!pageNumber) pageNumber = 1;

  if (!sortOrder || ALLOWED_MONGO_SORT_FILTERS.indexOf(sortOrder) === -1) sortOrder = -1;

  let totalResults = await Post.countDocuments({
    deleted: false
  });

  const totalPages = Math.ceil(totalResults / DEFAULT_PAGES_SIZE) || 1;

  if (totalPages < pageNumber) pageNumber = totalPages;

  let results = await Post.find({ deleted: false })
    .populate("author", "name username _id ")
    .skip(DEFAULT_PAGES_SIZE * (pageNumber - 1))
    .limit(DEFAULT_PAGES_SIZE)
    // default descending
    .sort({ postedDate: sortOrder ? sortOrder : -1 });

  res.status(200).json({
    posts: results,
  });
}

async function getPostById(req, res) {
  const { postId } = req.params;

  if (!postId || typeof postId !== "string")
    throw new HttpError("Post not found");

  const foundPost = await Post.findById(postId)
    .populate("author", "name username _id ");

  if (!foundPost) throw new HttpError("Post not found");

  const comments = await Comment.find({ postId: postId })
    .populate("author", "_id username")
    .sort({ postedDate: "desc" });

  foundPost.comments = comments;

  res.status(200).json(foundPost);
}

async function deletePost(req, res) {
  const { postId } = req.params;

  if (!postId || typeof postId !== "string")
    throw new HttpError("Post not found");

  if (process.env.ACTUAL_DELETE_DATA_ENABLED) {
    const postDeleted = await Post.findByIdAndDelete(postId);

    if (!postDeleted) throw new HttpError("Failed to delete post", 400);
  } else {
    const postDeleted = await Post.findById(postId);

    if (!postDeleted) throw new HttpError("Failed to delete post", 400);

    postDeleted.deleted = true;

    await postDeleted.save();
  }
  res.status(204).end();
}

module.exports = {
  createPost,
  getPosts,
  editPost,
  deletePost,
  getPostById,
};
