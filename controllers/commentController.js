if (require("dotenv")) require("dotenv").config();
const User = require("../models/user");
const HttpError = require("../utils/httpError");
const Comment = require("../models/comment");
const Post = require("../models/post");
const { isCommentContentValid } = require("../utils/customValidators");

async function createComment(req, res) {
  const { content } = req.body;

  const { postId } = req.params;

  if (!postId || typeof postId !== "string")
    throw new HttpError("Post not found");

  const foundPost = await Post.findById(postId, "_id");

  if (!foundPost) throw new HttpError("Post not found");

  const user = await User.findById(req.user.id, "username _id");

  let newComment = new Comment({
    content,
    postId: foundPost,
    author: user,
  });

  await newComment.save();

  await Post.updateOne(
    {
      _id: postId,
    },
    {
      $push: {
        comments: newComment._id,
      },
    }
  );

  res.status(201).json({ comment: newComment });
}

async function getComments(req, res) {
  const { postId, authorId, order } = req.params;

  const commentsFound = await Comment.find({ postId: postId })
    .populate("author", "_id username")
    .sort({ postedDate: "desc" });

  res.status(200).json({ comments: commentsFound });
}

async function editComment(req, res) {
  const { content } = req.body;
  const { commentId } = req.params;

  if (!commentId || typeof commentId !== "string")
    throw new HttpError("Comment does not exist");

  const foundComment = await Comment.findById(commentId, "_id author content");

  if (!foundComment) throw new HttpError("Comment not found");

  let isCommentEdited = false;

  if (
    content &&
    content !== foundComment.content &&
    isCommentContentValid(content)
  ) {
    foundComment.content = content;
    isCommentEdited = true;
  }

  if (isCommentEdited) {
    foundComment.edited = true;
    await foundComment.save();
    await Post.updateOne(
      {
        _id: postId,
      },
      {
        $push: {
          previousVersions: { content: content },
        },
      }
    );
  }
  res.status(200).json({ post: foundComment });
}

module.exports = { createComment, getComments, editComment };
