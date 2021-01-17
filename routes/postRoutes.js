const router = require("express").Router();
const { check } = require("express-validator");
const {exceptionHandler,asyncMiddlewareExceptionHandler} = require("../utils");
const { createPost, getAllPosts } = require("../controllers/postController");
const {
  authenticationMiddleware,
  authorizationMiddleware,
  errorCheckerMiddleware,
} = require("../middleware");
const {
  isPostContentValid,
  isPostTitleValid,
} = require("../utils/customValidators");
const {
  POST_CONTENT_ERROR,
  POST_TITLE_ERROR,
} = require("../utils/inputErrorMessages");

//@route api/posts/
//@desc Get all the posts
//@access Public
router.get("/", exceptionHandler(getAllPosts));

//@route api/posts/
//@desc Create a post
//@access Private and special privileges
router.post(
  "/",
  [
    check("title", POST_TITLE_ERROR)
      .trim()
      .custom((val) => isPostTitleValid(val)),
    check("content", POST_CONTENT_ERROR)
      .trim()
      .custom((val) => isPostContentValid(val)),
    errorCheckerMiddleware,
    authenticationMiddleware,
    asyncMiddlewareExceptionHandler(authorizationMiddleware),
  ],
  exceptionHandler(createPost)
);

module.exports = router;
