const router = require("express").Router();
const { check } = require("express-validator");
const {
  exceptionHandler,
  asyncMiddlewareExceptionHandler,
} = require("../utils");
const {
  createComment,
  getComments,
  editComment,
  getCommentById,
} = require("../controllers/commentController");
const {
  authenticationMiddleware,
  authorizationMiddleware,
  errorCheckerMiddleware,
  userCreateContentMiddleware,
} = require("../middleware");
const { isCommentContentValid } = require("../utils/customValidators");
const { COMMENT_CONTENT_ERROR } = require("../utils/inputErrorMessages");

//@route api/comments/
//@desc Get all the comments
//@access Public
router.get("/", exceptionHandler(getComments));

//@route api/comments/:commentId
//@desc Get the comment by id
//@access Public
router.get("/:commentId", exceptionHandler(getCommentById));

//@route api/comments/:postId
//@desc Create a comment
//@access Private
router.post(
  "/:postId",
  [
    check("content", COMMENT_CONTENT_ERROR)
      .trim()
      .custom((val) => isCommentContentValid(val)),
    errorCheckerMiddleware,
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(userCreateContentMiddleware),
  ],
  exceptionHandler(createComment)
);

//@route api/comment/:id
//@desc Edit a comment
//@access Private/special privileges
router.patch(
  "/:commentId",
  [
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(userCreateContentMiddleware),
    asyncMiddlewareExceptionHandler(authorizationMiddleware),
  ],
  exceptionHandler(editComment)
);

module.exports = router;
