if (require("dotenv")) require("dotenv").config();
const User = require("../models/user");
const HttpError = require("../utils/httpError");
const Comment = require("../models/comment");
const { isCommentContentValid } = require("../utils/customValidators");

async function createComment(req, res) {
  const { content } = req.body;

  const user = await User.findById(req.user.id, "username _id");

  let newComment = new Comment({
    content,
    author: user,
  });

  await newComment.save();

  res.status(201).json({ comment: newComment });
}

async function getComments(req, res) {
  const { postId, authorId, order } = req.params;

  const commentsFound = await Comment.find({ postId: postId })
    .populate("author", "_id username")
    .sort({ postedDate: "desc" });

  res.status(200).json({ comments: comments });
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
